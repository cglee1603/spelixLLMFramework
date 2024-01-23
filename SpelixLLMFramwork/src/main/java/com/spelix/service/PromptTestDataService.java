package com.spelix.service;

import java.util.List;

import com.spelix.domain.PromptTestData;

public interface PromptTestDataService {
	PromptTestData getPromptTestDataById(String promptId);

    List<PromptTestData> getAllPromptTestData();

    void savePromptTestData(PromptTestData promptTestData);

    void updatePromptTestData(PromptTestData promptTestData);

    void deletePromptTestData(String promptId);
}
