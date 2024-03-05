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
 * 챗봇
 */

var chatInput = document.querySelector("#chat-input");
var sendButton = document.querySelector("#send-btn");
var chatContainer = document.querySelector(".chat-container");
var userText = null;
var chatHistoryText = "";

function createChatElement(content, className) {
    var chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

function getChatResponse(incomingChatDiv) {
	var pElement = document.createElement("p");

	// chat history + current chat
	var promptInputStr = "# History #\n" + chatHistoryText + "\nUSER: " + userText;

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
	
	systemPromptConcat += promptArea.value;
		
	var tempJson = new Object();

	for (var parm in currentParamValueJson) {
		tempJson[parm] = currentParamValueJson[parm].defaultValue;
	}

	var requestParam = new Object();
	requestParam.prompt_id = "test";
	requestParam.model = modelMasterJsonById[selectedModelId].modelName;
	requestParam.prompt = promptInputStr;
	requestParam.system_prompt = systemPromptConcat;
	requestParam.properties = tempJson;
	requestParam.file_path_list = "";
	requestParam.additional_work = "";
	
	console.log("채팅 requestParam: ", requestParam);

	if (localStorage.getItem(JSON.stringify(requestParam)) != null) {
		console.log("local storage is not null");
		
		var tempReturnData = JSON.parse(localStorage.getItem(JSON.stringify(requestParam)));

		setTimeout(function() {
			pElement.textContent = tempReturnData.prompt_result;
			chatTypeingEnd(incomingChatDiv, pElement);
		}, 1000);
		
	} else {
		$.ajax({
			type: "POST",
			url: "getChatbotResponse.do",
			data: { requestParam : JSON.stringify(requestParam) },
			dataType: "json",
			async: true,
			success: function(data) {				
				pElement.textContent = data.prompt_result;
				localStorage.setItem(JSON.stringify(requestParam), JSON.stringify(data));
				chatTypeingEnd(incomingChatDiv, pElement);
				chatHistoryText += chatHistoryText.length ? "\n" : "";
				chatHistoryText += "USER: " + userText + "\Assistant: " + pElement.textContent;
				console.log(chatHistoryText);
			},
			error: function() {
				pElement.classList.add("error");
				pElement.textContent = "죄송합니다. 답변을 드릴 수 없습니다. 잠시후 다시 시도해 주세요.";
				chatTypeingEnd(incomingChatDiv, pElement);
			}
		});
	}
}

function chatTypeingEnd(incomingChatDiv, pElement) {
	incomingChatDiv.querySelector(".typing-animation").remove();
	incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
	localStorage.setItem("all-chats", chatContainer.innerHTML);
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

function showTypingAnimation() {
    // Display the typing animation and call the getChatResponse function
    // FIXME 절대 경로 설정
    var html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/SpelixLLMFramework/resources/img/ai_brain.svg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                </div>`;

    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");

    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

function handleOutgoingChat() {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    var html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/SpelixLLMFramework/resources/img/user3.svg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    var outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}


var initialInputHeight = chatInput.scrollHeight;

function adjustInputHeight() {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
}

chatInput.addEventListener("input", adjustInputHeight);

function handleKeyDown(e) {
    // If the Enter key is pressed without Shift and the window width is larger than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
}


chatInput.addEventListener("keydown", handleKeyDown);

sendButton.addEventListener("click", handleOutgoingChat);

