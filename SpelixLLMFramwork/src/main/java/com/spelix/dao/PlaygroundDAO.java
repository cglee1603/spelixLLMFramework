package com.spelix.dao;

import java.util.List;

import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptSystemDTO;

public interface PlaygroundDAO {

	List<PromptBaseDTO> getAllPromptBase();

	List<PromptSystemDTO> getPromptSystemInfo();

	List<PromptMasterDTO> getAllPromptMaster();

	List<String> getAllPromptModelList();

	String getModelParamJsonStr(String selectedModel);

}
