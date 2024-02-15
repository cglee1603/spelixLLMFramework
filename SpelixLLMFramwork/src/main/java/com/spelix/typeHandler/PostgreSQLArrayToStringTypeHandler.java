package com.spelix.typeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.postgresql.util.PGobject;

public class PostgreSQLArrayToStringTypeHandler extends BaseTypeHandler<String[]> {
	
	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, String[] parameter, JdbcType jdbcType)
			throws SQLException {
		// PostgreSQL 배열을 문자열로 변환하여 설정
		PGobject pgArray = new PGobject();
		pgArray.setType("varchar[]");
		pgArray.setValue(arrayToString(parameter));
		ps.setObject(i, pgArray);
	}

	@Override
	public String[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
		return parseArray(rs.getString(columnName));
	}

	@Override
	public String[] getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		return parseArray(rs.getString(columnIndex));
	}

	@Override
	public String[] getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		return parseArray(cs.getString(columnIndex));
	}

	private String arrayToString(String[] array) {
		if (array == null) {
			return null;
		}
		StringBuilder sb = new StringBuilder();
		sb.append("{");
		for (int i = 0; i < array.length; i++) {
			if (i > 0) {
				sb.append(",");
			}
			sb.append("\"").append(array[i]).append("\"");
		}
		sb.append("}");
		return sb.toString();
	}

	private String[] parseArray(String arrayString) {
		if (arrayString == null) {
			return null;
		}
		// PostgreSQL 배열 문자열 파싱 로직 추가
		// 여기서는 간단한 예시를 들기 위해 구현하지 않았습니다.
		// 실제 데이터 타입에 따라 적절한 파싱 로직을 구현해야 합니다.
		return arrayString.replaceAll("[{}]", "").split(",");
	}
}
