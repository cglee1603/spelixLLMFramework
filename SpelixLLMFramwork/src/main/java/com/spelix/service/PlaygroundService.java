package com.spelix.service;

import java.util.List;

import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;

public interface PlaygroundService {

	List<PromptBaseDTO> getAllPromptBase();

	List<String> getAllPromptSystemNameList();

	List<PromptMasterDTO> getAllPromptMaster();
	
	List<String> getAllPromptModelList();
	
	String getModelParamJsonStr(String selectedModel);

}
