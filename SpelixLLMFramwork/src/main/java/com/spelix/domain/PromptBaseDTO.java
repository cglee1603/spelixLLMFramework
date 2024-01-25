package com.spelix.domain;

import java.sql.Timestamp;

public class PromptBaseDTO {

	private String basePromptId;
	private String basePromptName;
	private String basePromptDesc;
	private String basePromptVer;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

	public String getBasePromptId() {
		return basePromptId;
	}

	public void setBasePromptId(String basePromptId) {
		this.basePromptId = basePromptId;
	}

	public String getBasePromptName() {
		return basePromptName;
	}

	public void setBasePromptName(String basePromptName) {
		this.basePromptName = basePromptName;
	}

	public String getBasePromptDesc() {
		return basePromptDesc;
	}

	public void setBasePromptDesc(String basePromptDesc) {
		this.basePromptDesc = basePromptDesc;
	}

	public String getBasePromptVer() {
		return basePromptVer;
	}

	public void setBasePromptVer(String basePromptVer) {
		this.basePromptVer = basePromptVer;
	}

	public String getInsertUser() {
		return insertUser;
	}

	public void setInsertUser(String insertUser) {
		this.insertUser = insertUser;
	}

	public Timestamp getInsertDate() {
		return insertDate;
	}

	public void setInsertDate(Timestamp insertDate) {
		this.insertDate = insertDate;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public Timestamp getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Timestamp updateDate) {
		this.updateDate = updateDate;
	}

	@Override
	public String toString() {
		return "PromptBaseDTO [basePromptId=" + basePromptId + ", basePromptName=" + basePromptName
				+ ", basePromptDesc=" + basePromptDesc + ", basePromptVer=" + basePromptVer + ", insertUser="
				+ insertUser + ", insertDate=" + insertDate + ", updateUser=" + updateUser + ", updateDate="
				+ updateDate + "]";
	}

}
