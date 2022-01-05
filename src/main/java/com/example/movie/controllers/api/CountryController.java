package com.example.movie.controllers.api;

import com.example.movie.exceptions.NotFoundException;
import com.example.movie.models.Country;
import com.example.movie.repositories.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("countries")
public class CountryController {
    @Autowired
    private CountryRepository countryRepository;

    @GetMapping
    public Iterable<Country> get(){
        return countryRepository.findAll();
    }

    @GetMapping("{id}")
    public Country getOne(@PathVariable(value = "id") long id){
        return countryRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    @PostMapping
    public Country add(@RequestBody Country country) {
        return countryRepository.save(country);
    }

    @PutMapping("{id}")
    public Country edit(@RequestBody Country newCountry, @PathVariable(value = "id") long id) {

        return countryRepository.findById(id)
                .map(country -> {
                    country.setName(newCountry.getName());
                    return countryRepository.save(country);
                })
                .orElseThrow(NotFoundException::new);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable(value = "id") long id){
        countryRepository.deleteById(id);
    }
}
