package com.spelix.domain;

import java.sql.Timestamp;

public class PromptSystemDTO {

	private String systemPromptId;
	private String systemPromptVer;
	private String systemPromptName;
	private String systemPrompt;
	private String constUser;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

	public String getSystemPromptId() {
		return systemPromptId;
	}

	public void setSystemPromptId(String systemPromptId) {
		this.systemPromptId = systemPromptId;
	}

	public String getSystemPromptVer() {
		return systemPromptVer;
	}

	public void setSystemPromptVer(String systemPromptVer) {
		this.systemPromptVer = systemPromptVer;
	}

	public String getSystemPromptName() {
		return systemPromptName;
	}

	public void setSystemPromptName(String systemPromptName) {
		this.systemPromptName = systemPromptName;
	}

	public String getSystemPrompt() {
		return systemPrompt;
	}

	public void setSystemPrompt(String systemPrompt) {
		this.systemPrompt = systemPrompt;
	}

	public String getConstUser() {
		return constUser;
	}

	public void setConstUser(String constUser) {
		this.constUser = constUser;
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
		return "PromptSystemDTO [systemPromptId=" + systemPromptId + ", systemPromptVer=" + systemPromptVer
				+ ", systemPromptName=" + systemPromptName + ", systemPrompt=" + systemPrompt + ", constUser="
				+ constUser + ", insertUser=" + insertUser + ", insertDate=" + insertDate + ", updateUser=" + updateUser
				+ ", updateDate=" + updateDate + "]";
	}

}
