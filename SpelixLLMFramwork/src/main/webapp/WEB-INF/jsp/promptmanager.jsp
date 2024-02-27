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
	href="<%=application.getContextPath()%>/resources/css/promptmanager.css">

</head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<body>
	<div class="wrapper">
		<div class="content">
 <div class="headtitle">
 <span class="promptmanagetitle"><strong>프롬프트 관리</strong></span>
 </div>
     <div class="maincontents">
          <div class="searchprompt">
          <label class="search-model">
          <span class="search-model-title">모델</span>
          <select class="search-model-list">
          <option value="all" disabled selected>전체</option>
          <option value="model1">model-1</option>

          </select>
          </label>
          </div>
          <div class="prompt-area">
        
          <div class="prompt-table-area">
          <div class="prompt-title-button">
          <div class="prompt-list-title">
          <h5>프롬프트 목록</h5>
          </div>
            <div class="prompt-delete-area">
          <button type="button" class="prompt-delete-button">선택 삭제</button>
          </div>
          </div>
          <div class="table-responsive">
          <table class="prompt-table">
          <thead>
          <tr>
          <th><div class="prompt-checkbox-area">
          <input type="checkbox" class="prompt-checkbox" id="prompt-checkbox">
          </div>
        </th>
          <th scope="col" class="promptId" data-field="promptId">ID</th>
          <th scope="col" class="promptVer" data-field="promptVer">버전</th>
          <th scope="col" class="model" data-field="model">모델</th>
          <th scope="col" class="promptName" data-field="promptName">제목</th>
          <th scope="col" class="promptDesc" data-field="promptDesc">설명</th>
          <th scope="col" class="promptType" data-field="promptType">타입</th>
          <th scope="col" class="llmCustomIds" data-field="llmCustomIds">Custom ID</th>
          <th scope="col" class="prompt" data-field="prompt">프롬프트</th>
          <th scope="col" class="promptTestId" data-field="promptTestId">Test ID</th>
          <th scope="col" class="promptRate" data-field="promptRate">정답률</th>
          <th scope="col" class="sysPromptIds" data-field="sysPromptIds">시스템 프롬프트 ID</th>
          <th scope="col" class="sysPromptEtc" data-field="sysPromptEtc">시스템 프롬프트</th>
          <th scope="col" class="parmJson" data-field="parmJson">파라미터</th>
          <th scope="col" class="insertDate" data-field="insertDate">등록일자</th>
          <th scope="col" class="verification">검증</th>
          <th scope="col" class="useYN" data-field="useYN">사용여부</th>
          </tr>
          </thead>
          <tbody>
          </tbody>
          </table>
          </div>
          <div class="pagination-wrapper">
									<ul class="pagination">
										<!-- 페이지네이션 링크가 여기에 동적으로 생성됩니다 -->
									</ul>
								</div>
          </div>
          </div>
        </div>
		</div>
	</div>


	<!-- jQuery -->
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<!-- select2 javascript cdn -->

	<script
		src="<%=application.getContextPath()%>/resources/js/promptmanager.js"></script>


</body>

</html>
