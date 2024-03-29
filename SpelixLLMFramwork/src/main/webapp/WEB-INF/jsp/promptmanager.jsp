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
<link
	href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />
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
		<div class="spelix-logo"><img src="<%=application.getContextPath()%>/resources/img/logo.png"></div>
				<span class="promptmanagetitle">프롬프트 관리</span>
			</div>
			<div class="maincontents">
				<div class="searchprompt">
					<label class="search-model"> <span
						class="search-model-title">모델</span> <select
						class="search-model-list" id="search-model-list">
							<option value="all" selected>전체</option>
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
								<button type="button" class="prompt-delete-button">선택
									삭제</button>
							</div>
						</div>
						<div class="prompt-table-srcoll">
							<table class="prompt-table" id="prompt-table">
								<thead>
									<tr>
										<th><div class="prompt-checkbox-area">
												<input type="checkbox" class="prompt-checkbox"
													id="prompt-checkbox">
											</div></th>
										<th class="promptId" data-field="promptId">ID</th>
										<th scope="col" class="promptVer" data-field="promptVer">버전</th>
										<th scope="col" class="model" data-field="model">모델</th>
										<th scope="col" class="promptName" data-field="promptName">제목</th>
										<th scope="col" class="promptDesc" data-field="promptDesc">설명</th>
										<th scope="col" class="promptType" data-field="promptType">타입</th>
										<th scope="col" class="llmCustomIds" data-field="llmCustomIds">Custom
											ID</th>
										<th scope="col" class="prompt" data-field="prompt">프롬프트</th>
										<th scope="col" class="promptTestId" data-field="promptTestId">Test
											ID</th>
										<th scope="col" class="promptRate" data-field="promptRate">정답률</th>
										<th scope="col" class="sysPromptIds" data-field="sysPromptIds">시스템
											프롬프트 ID</th>
										<th scope="col" class="sysPromptEtc" data-field="sysPromptEtc">시스템
											프롬프트</th>
										<th scope="col" class="parmJson" data-field="parmJson">파라미터</th>
										<th scope="col" class="insertDate" data-field="insertDate">등록일자</th>
										<th scope="col" class="verification" data-field="verification">검증</th>
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
	<div id="prompt-verification-modal" class="prompt-verification"
		style="display: none;">
		<div class="verification-content">
			<span class="prompt-close-button">&times;</span>
			<div class="prompt-verification-all">
				<div class="prompt-test-area">
					<div class="prompt-edit-area">
						<div class="prompt-edit-title">
							<h4>프롬프트 테스트</h4>
						</div>
						<div class="prompt-test-button-area">
							<button type="button" class="btn prompt-test-button">테스트</button>
						</div>

						<div class="prompt-edit-content">
							<div class="prompt-Id-area">
								<p class="prompt-title">ID</p>
								<div class="promptId"></div>
							</div>
							<div class="prompt-test-id-area">
								<p class="prompt-title">TEST_ID</p>
								<div class="promptTestId"></div>
							</div>
							<div class="prompt-Ver-area">
								<p class="prompt-title">버전</p>
								<div class="promptVer"></div>
							</div>
							<div class="model-area">
								<p class="prompt-title">모델</p>
								<div class="model"></div>
							</div>
							<div class="prompt-type-area">
								<p class="prompt-title">타입</p>
								<div class="promptType"></div>
							</div>
							<div class="sys-prompt-id-area">
								<p class="prompt-title-long">시스템 프롬프트 선택</p>
								<div class="sysPromptId">
									<select class="form-control selectsysPromptId"
										id="selectsysPromptId" multiple="multiple">
									</select>
								</div>
							</div>
							<div class="sys-prompt-etc-area">
								<p class="prompt-title-long">시스템 프롬프트 입력</p>
								<textarea class="sysPromptEtc-edit-text"
									id="sysPromptEtc-edit-text"></textarea>
							</div>
							<div class="test-prompt-area">
								<p class="prompt-title">프롬프트</p>
								<textarea class="prompt-edit-text" id="prompt-edit-text"></textarea>
							</div>
							<div class="parmJson-area">
								<p class="prompt-title">파라미터</p>
								<div class="paramJson"></div>
							</div>

						</div>
					</div>
					<div class="prompt-rate-area">
						<table class="rate-table">
							<thead>
								<tr>
									<th>History ID</th>
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
								<th class="question">Q</th>
								<th class="answer">A</th>
								<th class="result-th">모델 리턴 결과</th>
								<th class="correct">정답</th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>

				</div>

			</div>
			<!-- 내용을 로드할 컨테이너 -->
		</div>
	</div>

	<!-- jQuery -->
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<!-- select2 javascript cdn -->
	<script
		src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
	<script
		src="<%=application.getContextPath()%>/resources/js/promptmanager.js"></script>


</body>

</html>
