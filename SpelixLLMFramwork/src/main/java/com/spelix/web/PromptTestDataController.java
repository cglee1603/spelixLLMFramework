package com.spelix.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.spelix.domain.PromptTestData;
import com.spelix.service.PromptTestDataService;

import java.util.List;

@RestController
@RequestMapping("/promptTestData")
public class PromptTestDataController {

    private final PromptTestDataService promptTestService;

    @Autowired
    public PromptTestDataController(PromptTestDataService promptTestService) {
        this.promptTestService = promptTestService;
    }

    @GetMapping("/{promptId}")
    public ResponseEntity<PromptTestData> getPromptTestDataById(@PathVariable String promptId) {
        PromptTestData promptTestData = promptTestService.getPromptTestDataById(promptId);
        return promptTestData != null
                ? new ResponseEntity<PromptTestData>(promptTestData, HttpStatus.OK)
                : new ResponseEntity<PromptTestData>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<PromptTestData>> getAllPromptTestData() {
        List<PromptTestData> promptTestDataList = promptTestService.getAllPromptTestData();
        return new ResponseEntity<>(promptTestDataList, HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<Void> savePromptTestData(@RequestBody PromptTestData promptTestData) {
        promptTestService.savePromptTestData(promptTestData);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updatePromptTestData(@RequestBody PromptTestData promptTestData) {
        promptTestService.updatePromptTestData(promptTestData);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{promptId}")
    public ResponseEntity<Void> deletePromptTestData(@PathVariable String promptId) {
        promptTestService.deletePromptTestData(promptId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}