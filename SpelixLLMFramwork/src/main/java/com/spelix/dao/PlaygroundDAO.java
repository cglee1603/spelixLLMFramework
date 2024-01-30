package com.spelix.dao;

import java.util.List;

import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;

public interface PlaygroundDAO {

	List<PromptBaseDTO> getAllPromptBase();

	List<String> getAllPromptSystemNameList();

	List<PromptMasterDTO> getAllPromptMaster();

	List<String> getAllPromptModelList();

	String getModelParamJsonStr(String selectedModel);

}
