
function getIndex (list, id){
    for (var i = 0; i < list.length; i++){
        if (list[i].id === id){
            return i;
        }
    }

    return -1;
}

var countryAPI = Vue.resource('/countries{/id}');

Vue.component('country-form', {
    props: ['countries', 'countryEdit'],
    data: function (){
        return {
            name: '',
            id: '',
        }
    },
    watch: {
        countryEdit: function (newVal, oldVal){
            this.name = newVal.name;
            this.id = newVal.id;
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
            '<input type="text" placeholder="Название" v-model="name"/>' +
            '<span style="position: absolute; right: 0;">' +
                '<input type="button" value="Сохранить" @click="save"/>' +
                '<input type="button" value="Очистить" @click="clear"/>' +
            '</span>' +
        '</div>',
    methods: {
        save: function (){
            var country = { name: this.name };

            if (this.id) {
                countryAPI.update({id: this.id}, country).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.countries, data.id)
                        this.countries.splice(index, 1, data);
                        this.name = '';
                        this.id = '';
                    })
                )
            } else {
                countryAPI.save({}, country).then(result =>
                    result.json().then(data => {
                        this.countries.push(data);
                        this.name = '';
                    })
                )
            }
        },
        clear: function (){
            this.name = '';
            this.id = '';
        }
    }
});

Vue.component('country-row', {
    props: ['country', 'editMethod', 'countries'],
    template:
        '<div>' +
            '<b>{{ country.id }})</b> {{ country.name }}' +
            '<span style="position: absolute; right: 0;">' +
                '<input type="button" value="Изменить" @click="edit"/>' +
                '<input type="button" value="Удалить" @click="del"/>' +
            '</span>' +
        '</div>',
    methods: {
        edit: function (){
            this.editMethod(this.country);
        },
        del: function (){
            countryAPI.remove({id: this.country.id}).then(result => {
                if (result.ok){
                    this.countries.splice(this.countries.indexOf(this.country), 1)
                }
            })
        }
    }
});

Vue.component('countries-list', {
    props: ['countries'],
    data: function (){
        return {
            country: null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
            '<country-form :countries="countries" :countryEdit="country"/>' +
            '<br/>' +
            '<country-row v-for="country in countries" :key="country.id" :country="country" :editMethod="editMethod" :countries="countries"/>' +
        '</div>',
    methods: {
        editMethod: function (country){
            this.country = country;
        }
    }
});

var app = new Vue({
    el: '#app',
    template:
        '<div>' +
            '<div v-if="!profile">Авторизоваться: <a href="/login">Войти</a></div>' +
            '<div v-else>' +
                '<div>{{profile.name}}&nbsp;<a href="/logout">Выйти</a></div>' +
                '<br/>' +
                '<countries-list :countries="countries"/>' +
            '</div>' +
        '</div>',
    data: {
        countries: frontendData.countries,
        profile: frontendData.profile
    }
});

