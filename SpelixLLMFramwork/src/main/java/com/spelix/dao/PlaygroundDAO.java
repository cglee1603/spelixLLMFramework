package com.spelix.dao;

import java.util.List;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.ModelTypeMasterDTO;
import com.spelix.domain.ParameterMasterDTO;
import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptSystemDTO;

public interface PlaygroundDAO {

	List<PromptBaseDTO> getAllPromptBase();

	List<PromptSystemDTO> getPromptSystemInfo();

	List<PromptMasterDTO> getAllPromptMaster();

	List<ModelMasterDTO> getAllPromptModelList();

	List<ParameterMasterDTO> getParamMasterByParamId(String[] paramIdsArray);

	ModelTypeMasterDTO getModelTypeMaster(String selectedModelTypeName);

}
