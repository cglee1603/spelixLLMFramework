package com.spelix.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.spelix.domain.PromptTestData;

@Repository
public interface PromptTestDataDAO {

	PromptTestData getPromptTestDataById(String promptId);

	List<PromptTestData> getAllPromptTestData();

	void savePromptTestData(PromptTestData promptTestData);

	void updatePromptTestData(PromptTestData promptTestData);

	void deletePromptTestData(String promptId);
}