<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Azure AI Studio Interface</title>



<link href="http://www.jqueryscript.net/css/jquerysctipttop.css"
	rel="stylesheet" type="text/css">

<link
	href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"
	rel="stylesheet">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/global.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/styleguide.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/prompttest.css">

</head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<body>
	<div class="wrapper">
		<div class="content">
		<div class="maincontents">
		<div class="prompt-test-area">
		<div class="prompt-edit-area">
		<div class="prompt-edit-title">
		<h4>프롬프트 테스트</h4>
		</div>
		<div class="prompt-edit-content">
		<div class="prompt-Id-area">
		
		<p class="prompt-title">ID</p>
		<div class="promptId"></div>
		
		</div>
		<div class="prompt-Ver-area">
	
		<p class="prompt-title">버전</p>
		<div class="promptVer"></div>
	
		</div>
		<div class="model-area">
		
		<p class="prompt-title">모델</p>
		<div class="model"></div>
		
		</div>
		<div class="prompt-area">
					
		<p class="prompt-title">프롬프트</p>

		<textarea class="prompt-edit-text" id="prompt-edit-text">
		</textarea>

		
		</div>
		<div class="parmJson-area">
						
		<p class="prompt-title">파라미터</p>
		<div class="paramJson">

		</div>
		
		</div>
		</div>
		</div>
          <div class="prompt-rate-area">
          <table class="rate-table">
          <thead>
          <tr>
          <th>Test ID</th>
          <th>변경사항</th>
          <th>정답률</th>
          </tr>
          </thead>
          <tbody>
          
          </tbody>
          </table>
          </div>
		</div>
		<div class="prompt-response-area">
		<table class="response-table">
          <thead>
          <tr>
          <th>Q</th>
          <th>A(llm결과)</th>
          <th>결과</th>
          <th>정답여부</th>
          </tr>
          </thead>
          <tbody>
          
          </tbody>
          </table>
		</div>
		</div>
		</div>
	</div>


	<!-- jQuery -->
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<!-- select2 javascript cdn -->

	<script
		src="<%=application.getContextPath()%>/resources/js/prompttest.js"></script>


</body>

</html>
