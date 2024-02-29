
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

	var tempJson = new Object();

	for (var parm in currentParamValueJson) {
		tempJson[parm] = currentParamValueJson[parm].defaultValue;
	}

	var requestParam = new Object();
	requestParam.prompt_id = "test";
	requestParam.model = modelMasterJsonById[selectedModelId].modelName;
	requestParam.prompt = inputTxt;
	requestParam.properties = tempJson;

	console.log("프롬프트 requestParam: ", requestParam);

	$.ajax({
		type: "POST",
		url: "getChatbotResponse.do",
		data: { requestParam : JSON.stringify(requestParam) },
		dataType: "json",
		success: function(data, status) {			
			resultText.innerHTML = data.prompt_result + "<br>";			
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


