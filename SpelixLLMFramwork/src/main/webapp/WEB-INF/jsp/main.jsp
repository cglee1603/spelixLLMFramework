<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Azure AI Studio Interface</title>
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/main.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/global.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/styleguide.css">
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="<%=application.getContextPath()%>/resources/js/main.js"></script>
</head>

<body>

	<header>
		<!-- 헤더 메뉴 내용 -->
		<nav>
			<ul>
				<li><a href="#home">홈</a></li>
				<li><a href="#news">뉴스</a></li>
				<li><a href="#contact">연락처</a></li>
				<li><a href="#about">정보</a></li>
			</ul>
		</nav>
	</header>
	<div class="wrapper">
		<div class="sidebar">
			<div class="menu">
				<div class="menu-item playground">플레이그라운드</div>
				<div class="menu-item settingmodel">모델관리</div>
				<div class="menu-item prompt">프롬프트 흐름</div>

			</div>
		</div>
		<div class="maincontent">
			<iframe id="pocframe" src="playground"></iframe>
		</div>
	</div>
</body>
</html>
