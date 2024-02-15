
/*
 * 모델 선택
 */
var modelNameTypeJson = {};

$(document).ready(function () {
    var $modelSelect = $('#selectmodel');

    function loadPromptModelList() {
        $.ajax({
            type: "POST",
            url: "getAllPromptModelList.do",
            success: function (data) {
                $.each(data, function(index, value){
                    var option = new Option(value.modelName, value.modelName);
                    $modelSelect.append(option);
                    
                    modelNameTypeJson[value.modelName] = value.modelType; 
                });
            },
            error: function (error) {
                alert("모델을 가져오는 데 실패했습니다.");
            }
        });
    }
    
    loadPromptModelList();
});

// 모델 선택 이벤트 핸들러
$('#selectmodel').on('change', function () {
    selectedModel = this.value;

    var paramContainer = document.querySelector('.paramall');
    paramContainer.innerHTML = '';
    currentParamValueJson = {};

    $.ajax({
        type: "POST",
        data: { selectedModelTypeName: modelNameTypeJson[selectedModel] },
        url: "getParamMasterByParamId.do",
        success: function (data) {
            $.each(data, function(index, value){
                createParam(paramContainer, value);
            });
        },
        error: function (error) {
            alert("모델 파라미터를 가져오는 데 실패했습니다.");
        }
    });
});



function createParam(paramContainer, json) {
    var newParamDiv = document.createElement('div');
    newParamDiv.classList.add('param');
    newParamDiv.innerHTML = `
        <div class="param-1">
            <div class="paramtitle">${json.parameterName}</div>
            <div class="prograss">
                <input type="range" class="parambar" id="parambar" value="${json.defaultValue}"
                    min="${json.minValue}" max="${json.maxValue}">
                <input type="text" class="paramInput" id="paramInput" value="${json.defaultValue}">
            </div>
        </div>`;
    paramContainer.appendChild(newParamDiv);
    
    var progressBar = newParamDiv.querySelector('.parambar');
    let textInput = newParamDiv.querySelector('.paramInput');
    
    var tempJson = {};
    tempJson.minValue = json.minValue;
    tempJson.maxValue = json.maxValue;
    tempJson.defaultValue = textInput.value;
    tempJson.parameterName = json.parameterName;
    
    currentParamValueJson[json.parameterName] = tempJson;

    progressBar.addEventListener('input', function() {
        textInput.value = this.value;
        tempJson.defaultValue = textInput.value;

        currentParamValueJson[json.parameterName] = tempJson;
    });
    
}





/*
 * 모드 변경시 다른 페이지 로드
 */
$(document).ready(function() {
    // 페이지 로드 시 기본 콘텐츠 로드
    loadContent('playgroundchat');

    // 모드 변경 시 콘텐츠 재로드
    $('#changemode').on('change', function() {
        var selectedMode = $(this).val();
        loadContent(selectedMode);
    });
});
// TODO 변수들 초기화
function loadContent(mode) {
    $.ajax({
        url: '/SpelixLLMFramework/' + mode, // 예:
											// /SpelixLLMFramework/playgroundchat
											// 또는
											// /SpelixLLMFramework/playgroundprompt
        type: 'GET',
        success: function(response) {
            // 서버로부터 받은 HTML 컨텐츠를 maincontents 영역에 삽입
            $('#maincontents').html(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}


// 불러오기 팝업 창 열기 및 닫기 스크립트
 var importpopup = document.getElementById("import-prompt-popup");
 var importprompt = document.querySelector(".import-prompt");
 var closeButton = document.getElementsByClassName("import-close-button")[0];

// 프롬프트 샘플 팝업 열기
 importprompt.onclick = function() {
 importpopup.style.display = "block"; 

 }
// 프롬프트 샘플 팝업 닫기
 closeButton.onclick = function() {
 importpopup.style.display = "none";
 }

 window.onclick = function(event) {
 if (event.target == importpopup) {
 importpopup.style.display = "none";
 }
 }


// 프롬프트 샘플 팝업 창 열기 및 닫기 스크립트
 var popup = document.getElementById("prompt-sample-popup");
 var promptSample = document.querySelector(".prompt-sample");
 var closeButton = document.getElementsByClassName("close-button")[0];
var promptBaseId;
 
// 프롬프트 샘플 팝업 열기
 promptSample.onclick = function() {
	 
		if (typeof selectedModel === 'undefined') {
			alert("프롬프트 샘플 가져오기 실패. 모델을 선택해 주세요.");
			return;
		}
	 
 popup.style.display = "block"; 
 $.ajax({
	 type: "POST",
	 url: "selectPromptSample.do",
	 success: function(data){
		  $(".base-prompt-all").empty();
            $.each(data, function(index, value){
                var promptSampleDiv = $('<div class="base-prompt-sample"></div>');
                promptSampleDiv.append('<div class="base-prompt-title">' + value.basePromptName + '</div>');
                promptSampleDiv.append('<div class="base-prompt-desc">' + value.basePromptDesc + '</div>');

                $(".base-prompt-all").append(promptSampleDiv);
                promptSampleDiv.click(function() {
                    $('#chat-input').val(value.basePromptDesc);
                    promptBaseId = value.basePromptId;
                    console.log("promptBaseId: ",promptBaseId);
                    popup.style.display = "none";
                });
            });
        },
	 error: function(error){
		 alert("프롬프트 샘플을 가져오는 데 실패했습니다.")
 }
 }) 
 }
// 프롬프트 샘플 팝업 닫기
 closeButton.onclick = function() {
 popup.style.display = "none";
 }

 window.onclick = function(event) {
 if (event.target == popup) {
 popup.style.display = "none";
 }
 }


 
 
/*
 * json 파일 내보내기
 */
document.getElementById('export-file').addEventListener('click', exportToFile);

function exportToFile() {
	
	if (typeof selectedModel === 'undefined') {
		alert("내보내기 실패. 모델을 선택해 주세요.");
		return;
	}
	
    var fileContent = {};
    fileContent.model = selectedModel;
	fileContent.parameters = currentParamValueJson;

	var systemPromtSelectedValue =(localStorage.getItem("systemPromptSelectedValue") == null || localStorage.getItem("systemPromptSelectedValue").length == 0)?"":localStorage.getItem("systemPromptSelectedValue");
	var systemPromptInputValue = (localStorage.getItem("systemPromptInputValue") == null || localStorage.getItem("systemPromptInputValue").length == 0)?"":localStorage.getItem("systemPromptInputValue");			
	fileContent.systemPrompt = systemPromtSelectedValue + " " + systemPromptInputValue;
// fileContent.variables = ;

    var blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'setting.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}




/*
 * json 파일 가져오기
 */
document.getElementById('import-file').addEventListener('change', importFromFile);

function importFromFile() {
	 var fileInput = document.getElementById('import-file');
	    var file = fileInput.files[0];

	    if (file) {
	        var reader = new FileReader();
	        reader.readAsText(file);

	        reader.onload = function (e) {
	            var fileContent = e.target.result;

	            try {
	                var jsonData = JSON.parse(fileContent);

	                // model 설정
	                selectedModel = jsonData.model;
	                $("#selectmodel").val(selectedModel);

	                // param 설정
	                var paramContainer = document.querySelector('.paramall');
	                paramContainer.innerHTML = '';
	                currentParamValueJson = {};
	                
	                for (var tmp in jsonData.parameters) {
	                	createParam(paramContainer, jsonData.parameters[tmp]);
	                }
	                
	                // system prompt 설정
	            	localStorage.removeItem("systemPromptSelectedValue");
	            	localStorage.removeItem("systemPromptInputValue");
	            	
	            	var systemPromptTxt = jsonData.systemPrompt;
	            	localStorage.setItem("systemPromptInputValue", systemPromptTxt);
	            	promptArea.value = systemPromptTxt;

	            } catch (error) {
	                console.error('JSON 파싱 오류:', error);
	            }
	        };

	    } else {
	        alert('파일을 가져오는 데 실패했습니다.');
	    }

}



/*
 * 저장하기
 */
document.getElementById('save-prompt-master').addEventListener('click', savePromptMaster);

function savePromptMaster(){
	
	if (typeof selectedModel === 'undefined') {
		alert("저장하기 실패. 모델을 선택해 주세요.");
		return;
	}
	
	var promptType = $("#changemode option:selected").text();
	
	var selectedSysPromptValue = $(".promptlist option:selected").map(function() {
	    return $(this).text();
	}).get();
	var sysPromptIds = [];
	for (var selected of selectedSysPromptValue) {
		sysPromptIds.push(JSON.parse(localStorage.getItem("systemPromptSelectOption"))[selected].systemPromptId);
		}
	
	var requestParam = new Object();
	requestParam.promptVer = "0001";
	requestParam.model = selectedModel;
	requestParam.promptName = "test";
	requestParam.basePromptId = promptBaseId;
	requestParam.useYN = "Y";
	requestParam.parmJson = JSON.stringify(currentParamValueJson);
	requestParam.promptType = promptType;
	requestParam.sysPromptIds = sysPromptIds;

	if (promptType === "프롬프트"){
		requestParam.prompt = inputTxt;
	}
	
	if (localStorage.getItem("systemPromptInputValue") != null){
		requestParam.sysPromptEtc = localStorage.getItem("systemPromptInputValue");
	}
	
	console.log("requestParam: ",requestParam);
	
	$.ajax({
	    type: "POST",
	    data: requestParam,
	    url: "savePromptMaster.do",
	    traditional: true,
	    success: function (data) {
	        alert("저장하기 성공");
	    },
	    error: function (error) {
	        alert("저장하기 실패");
	    }
	});
	
}




/*
 * 변수 초기화
 */
function initializeVariable(){
	
}
