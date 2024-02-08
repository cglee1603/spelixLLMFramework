package com.spelix.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.postgresql.jdbc.PgArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spelix.dao.PlaygroundDAO;
import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.ModelTypeMasterDTO;
import com.spelix.domain.ParameterMasterDTO;
import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptSystemDTO;
import com.spelix.service.PlaygroundService;
import com.spelix.web.MainController;

@Service
public class PlaygroundServiceImpl implements PlaygroundService {

	private static final Logger log = LoggerFactory.getLogger(MainController.class);

	@Autowired
	PlaygroundDAO playgroundDAO;

	public List<PromptBaseDTO> getAllPromptBase() {
		return playgroundDAO.getAllPromptBase();
	}

	public List<PromptSystemDTO> getPromptSystemInfo() {
		return playgroundDAO.getPromptSystemInfo();
	}

	public List<PromptMasterDTO> getAllPromptMaster() {
		return playgroundDAO.getAllPromptMaster();
	}

	public List<ModelMasterDTO> getAllPromptModelList() {
		return playgroundDAO.getAllPromptModelList();
	}

	public List<ParameterMasterDTO> getParamMasterByParamId(String selectedModelTypeName) {

		ModelTypeMasterDTO modelTypeMaster = playgroundDAO.getModelTypeMaster(selectedModelTypeName);

		PgArray pgArray = (PgArray) modelTypeMaster.getModelTypeParameters();
		String[] paramIdsArray = null;

		try {
			paramIdsArray = (String[]) pgArray.getArray();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return playgroundDAO.getParamMasterByParamId(paramIdsArray);
	}

	public int savePromptMaster(PromptMasterDTO promptMasterDTO) {
		return playgroundDAO.savePromptMaster(promptMasterDTO);
	}

}
