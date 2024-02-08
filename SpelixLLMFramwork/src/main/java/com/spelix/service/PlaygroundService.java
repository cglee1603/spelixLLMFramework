package com.spelix.service;

import java.util.List;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.ParameterMasterDTO;
import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptSystemDTO;

public interface PlaygroundService {

	List<PromptBaseDTO> getAllPromptBase();

	List<PromptSystemDTO> getPromptSystemInfo();

	List<PromptMasterDTO> getAllPromptMaster();

	List<ModelMasterDTO> getAllPromptModelList();

	List<ParameterMasterDTO> getParamMasterByParamId(String selectedModelTypeName);

	int savePromptMaster(PromptMasterDTO promptMasterDTO);

}
