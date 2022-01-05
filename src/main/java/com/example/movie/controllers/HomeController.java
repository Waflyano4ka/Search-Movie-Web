package com.example.movie.controllers;

import com.example.movie.models.User;
import com.example.movie.repositories.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;

@Controller
@RequestMapping("/")
public class HomeController {
    private final CountryRepository countryRepository;
    @Autowired
    public HomeController(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @GetMapping
    public String home(Model model, @AuthenticationPrincipal User user){
        HashMap<Object, Object> data = new HashMap<>();
        data.put("profile", user);
        data.put("countries", countryRepository.findAll());

        model.addAttribute("frontendData", data);
        return "index";
    }
}
