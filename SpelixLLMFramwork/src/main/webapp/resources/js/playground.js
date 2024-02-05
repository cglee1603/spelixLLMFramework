
/*
 * 모델 선택
 */
var modelNameTypeJson = {};

$(document).ready(function () {
    var $modelList = $('.selectmodel');

    function loadPromptModelList() {
        $.ajax({
            type: "POST",
            url: "getAllPromptModelList.do",
            success: function (data) {
                // 데이터를 <option> 태그로 변환하고 select 요소에 추가
            	$.each(data, function(index, value){
                    var option = new Option(value.modelName, value.modelName);
                    $modelList.append($(option));
                    
                    modelNameTypeJson[value.modelName] = value.modelType; 
                });

                $modelList.select2({
                    placeholder: '모델을 선택해 주세요'
                });
            },
            error: function (error) {
                alert("모델을 가져오는 데 실패했습니다.");
            }
        });
    }
    
    loadPromptModelList();
});


/*
 * 모델 선택 후 파라미터 동적 생성
 */
var selectedModel = "";
var currentParamValueJson = {};

$('.selectmodel').on('select2:select', function (e) {
    selectedModel = e.params.data.text;

    var paramContainer = document.querySelector('.paramall');
    paramContainer.innerHTML = '';
    currentParamValueJson = {};

    $.ajax({
        type: "POST",
        data: { selectedModelTypeName: modelNameTypeJson[selectedModel] },
        url: "getParamMasterByParamId.do",
        success: function (data) {
            $.each(data, function(index, value){
                var newParamDiv = document.createElement('div');
                newParamDiv.classList.add('param');
                newParamDiv.innerHTML = `
                    <div class="param-1">
                        <div class="paramtitle">${value.parameterName}</div>
                        <div class="prograss">
                            <input type="range" class="parambar" id="parambar" value="${value.defaultValue}"
                                min="${value.minValue}" max="${value.maxValue}">
                            <input type="text" class="paramInput" id="paramInput" value="${value.defaultValue}">
                        </div>
                    </div>`;
                paramContainer.appendChild(newParamDiv);
                
                var progressBar = newParamDiv.querySelector('.parambar');
                let textInput = newParamDiv.querySelector('.paramInput');
                
                var tempJson = {};
                tempJson.min = value.minValue;
                tempJson.max = value.maxValue;
                tempJson.value = textInput.value;
                
                currentParamValueJson[value.parameterName] = tempJson; 

                progressBar.addEventListener('input', function() {
                    textInput.value = this.value;

                    currentParamValueJson[value.parameterName] = textInput.value; 
                });
            });
        },
        error: function (error) {
            alert("모델 파라미터를 가져오는 데 실패했습니다.");
        }
    });
});




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

// 프롬프트 샘플 팝업 열기
 promptSample.onclick = function() {
 popup.style.display = "block"; 
 $.ajax({
	 type: "POST",
	 url: "selectPromptSample.do",
	 success: function(data){
		  $(".base-prompt-all").empty(); // 이전 데이터를 비웁니다.
            $.each(data, function(index, value){
                // 각 프롬프트 샘플에 대한 요소를 생성합니다.
                var promptSampleDiv = $('<div class="base-prompt-sample"></div>');
                promptSampleDiv.append('<div class="base-prompt-title">' + value.basePromptName + '</div>');
                promptSampleDiv.append('<div class="base-prompt-desc">' + value.basePromptDesc + '</div>');

                // 생성된 요소를 base-prompt-all 클래스를 가진 요소에 추가합니다.
                $(".base-prompt-all").append(promptSampleDiv);
         // 클릭 이벤트 핸들러를 추가합니다.
                promptSampleDiv.click(function() {
                    // chat-input 필드에 프롬프트 설명을 삽입합니다.
                    $('#chat-input').val(value.basePromptDesc);
                    // 팝업을 닫습니다.
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
function exportToFile() {
    // 파일 내용 생성 또는 가져오기
    var fileContent = {};

	 fileContent.model = selectedModel;
	 fileContent.parameters = currentParamValueJson;
	 fileContent.systemPrompt = (localStorage.getItem("systemPromptSelectedValue") == null)?"":localStorage.getItem("systemPromptSelectedValue") 
			 + " " + (localStorage.getItem("systemPromptInputValue") == null)?"":localStorage.getItem("systemPromptInputValue");
// fileContent.variables = ;

    
    var blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'setting.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.getElementById('export-file').addEventListener('click', exportToFile);



