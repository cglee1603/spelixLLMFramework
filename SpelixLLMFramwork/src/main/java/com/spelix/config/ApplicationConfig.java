package com.spelix.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
@PropertySource(value = { "classpath:application.properties" })
@Getter
public class ApplicationConfig {

	@Value("${spelix.host}")
	private String host;

	@Value("${spelix.port}")
	private String port;

	@Value("${spelix.path}")
	private String path;
}
