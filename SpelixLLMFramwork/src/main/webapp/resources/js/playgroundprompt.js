var selectedSystemPrompt;
var selectedSystemPromptId;
var systemPromptJsonById = {};

/*
 * 시스템 프롬프트 선택
 */
var $promptList = $('#promptlist');

$(document).ready(function () {

    function loadPromptData() {
        $.ajax({
            type: "POST",
            url: "getPromptSystemInfo.do",
            async: false,
            success: function (data) {
            	var systemPromptInfoJson = {};
            	
                data.forEach(function (item) {
                    var option = new Option(item.systemPromptName, item.systemPromptId);
                    $promptList.append($(option));

                    systemPromptJsonById[item.systemPromptId] = item;
                });

                $promptList.select2({
                    placeholder: '프롬프트를 선택해 주세요',
                    multiple: true
                });
 
            },
            error: function (error) {
                alert("시스템 프롬프트를 가져오는 데 실패했습니다.");
            }
        });
    }

    loadPromptData();

});

// 시스템 프롬프트 선택 변동 시 동작
$promptList.on('change', function (e) {      
	
    selectedSystemPrompt = $(this).find('option:selected').map(function () {
        return $(this).text();
    }).get();
    
    selectedSystemPromptId = $(this).find('option:selected').map(function () { return $(this).val(); }).get();

});


/*
 * 시스템 프롬프트 입력
 */
var promptArea = document.getElementById('sysprompttextarea');


/*
 * 변수 추가
 */
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("variableModal");
    var btn = document.querySelector(".variableltitle");
    var closeBtn = document.querySelector(".modal-close");
    var addBtn = document.getElementById("addVariableButton");

    btn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    addBtn.onclick = function() {
        var input = document.getElementById("variableInput").value;
        if (!input.trim()) {
            alert("텍스트를 입력하세요.");
            return;
        }

        var container = document.getElementById("variablesContainer");
        var newVariable = document.createElement("div");
        newVariable.classList.add("variableItem");
        newVariable.textContent = input;

        var deleteBtn = document.createElement("span");
        deleteBtn.textContent = "x";
        deleteBtn.classList.add("deleteButton");
        deleteBtn.onclick = function() {
            container.removeChild(newVariable);
        };

        newVariable.appendChild(deleteBtn);
        container.appendChild(newVariable);

        modal.style.display = "none";
        document.getElementById("variableInput").value = "";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});



/*
 * 프롬프트 입력 결과 받기
 */
var promptArea = document.getElementById('promptarea');
var resultText = document.querySelector('.result-text');
var inputTxt;


promptArea.addEventListener('input', function() {
    inputTxt = promptArea.value;
});


document.getElementById('prompt-input-button').addEventListener('click', getLlmResponse);

function getLlmResponse () {
	const pElement = document.createElement("p");

	// parameters
	var tempJson = new Object();

	for (var parm in currentParamValueJson) {
		tempJson[parm] = currentParamValueJson[parm].defaultValue;
	}
	
	// system prompt
	var systemPromptConcat = "";
	
	if (typeof selectedSystemPromptId !== 'undefined') {
		for (var key of selectedSystemPromptId) {
			if (systemPromptConcat.length !== 0 && systemPromptConcat.charAt(systemPromptConcat.length - 1) !== ".") {
				systemPromptConcat += ".";
			}
			systemPromptConcat += systemPromptJsonById[key].systemPrompt;
		}
	}

	if (systemPromptConcat.length !== 0 && systemPromptConcat.charAt(systemPromptConcat.length - 1) !== ".") {
		systemPromptConcat += ".";
	}
	
	systemPromptConcat += document.getElementById('sysprompttextarea').value;
	

	var requestParam = new Object();
	requestParam.prompt_id = "test";
	requestParam.model = modelMasterJsonById[selectedModelId].modelName;
	requestParam.prompt = inputTxt;
	requestParam.properties = tempJson;
	requestParam.system_prompt = systemPromptConcat;

	console.log("프롬프트 requestParam: ", requestParam);

	$.ajax({
		type: "POST",
		url: "getChatbotResponse.do",
		data: { requestParam : JSON.stringify(requestParam) },
		dataType: "json",
	    success: function(data, status) {
	        var resultContainer = document.querySelector(".result-container");
	        resultContainer.innerHTML = ''; // 기존 내용 제거

	        var resultTextWrapper = document.createElement("div");
	        resultTextWrapper.classList.add("result-text-wrapper");

	        var pElement = document.createElement("p");
	        pElement.innerHTML = data.prompt_result;
	        resultTextWrapper.appendChild(pElement);

	        // 복사 버튼 추가
	        addCopyButton(resultTextWrapper);

	        resultContainer.appendChild(resultTextWrapper);
	      },
		error: function(xhr, status, error) {
			resultText.innerHTML = "죄송합니다. 답변을 드릴 수 없습니다. 잠시후 다시 시도해 주세요." + "<br>";
		}
	});
}




function typeWriter(element, text, i = 0) {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
    setTimeout(() => typeWriter(element, text, i), 100);
  } else {
    // 타이핑이 끝난 후 커서를 숨김
    element.style.borderRight = "none";
  }
}

//복사 버튼을 추가하는 함수 
function addCopyButton(resultTextWrapper) {
  var copyButton = document.createElement("img");
  copyButton.src = "resources/img/copy-icon.svg";
  copyButton.classList.add("copy-button");
  
  copyButton.onclick = function() {
    var textToCopy = resultTextWrapper.querySelector("p").textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast("복사되었습니다");
    }).catch(err => {
      console.error('Error in copying text: ', err);
    });
  };
  
  resultTextWrapper.appendChild(copyButton);
}
