var pageSize = 10;
var currentPage = 1; 
//var modelNameTypeJson = {};
//window.promptData = []; // 전역 변수로 프롬프트 데이터 저장
var selectedSystemPrompt;
var selectedSystemPromptId;
var systemPromptJsonById = {};

var $promptList = $('#selectsysPromptId');

$(document).ready(function() {
	loadPromptModelList();
	loadPromptData();
	setupEventHandlers();
	loadSystemPrompts(); // 새로운 함수 호출
});

function loadPromptModelList() {
	var $modelSelect = $('#search-model-list');
	ajaxCall("POST", "promptmanager/getAllPromptModelList.do", {}, 
			function(data) {
		data.forEach(function(value) {
			var option = new Option(value.modelName, value.modelId);
			$modelSelect.append(option);
//			modelNameTypeJson[value.modelName] = value.modelType;
		});
	},
	function() {
		alert("모델을 가져오는 데 실패했습니다.");
	}
	);
}

function loadPromptData() {
	ajaxCall("POST", "promptmanager/getAllPromptMaster.do", {},
			   function(data) {
        // 필터링 로직을 추가하기 위해 전역 변수에 저장
        window.allPromptData = data;
        filterAndDisplayData();
    },
    function() {
        alert("프롬프트 마스터를 가져오는 데 실패했습니다.");
    }
);
}

// 기존 setupEventHandlers 함수에 이벤트 핸들러 추가
function setupEventHandlers() {
	$('#select-all-checkbox').change(function() {
		$('.prompt-checkbox').prop('checked', $(this).is(':checked'));
	});

	$('.prompt-delete-button').click(deleteSelectedPrompts);

    $('#search-model-list').change(filterAndDisplayData);


 // 사용 여부 버튼에 대한 이벤트 핸들러 추가
    $(document).on('click', '#prompt-useyn-button', function() {
        var $button = $(this);
        var promptId = $button.closest('tr').find('.promptId').text();
        var currentUseYN = $button.siblings('.useYN-value').val(); // Hidden input에서 현재 상태 읽기
        var newUseYN = currentUseYN === 'Y' ? 'N' : 'Y'; // 새로 업데이트할 상태
        
        console.log("current: "+currentUseYN);
        console.log("new: "+newUseYN);

        $.ajax({
            url: 'promptmanager/updateUseYNPromptMaster.do',
            method: 'POST',
            data: { promptId: promptId, useYN: newUseYN },
            success: function(response) {
                if(response === 'Y') {
                    $button.text('사용').removeClass('btn-secondary').addClass('btn-success');
                    $button.siblings('.useYN-value').val('Y'); // Hidden input 업데이트
                } else if(response === 'N') {
                    $button.text('미사용').removeClass('btn-success').addClass('btn-secondary');
                    $button.siblings('.useYN-value').val('N'); // Hidden input 업데이트
                }
            },
            error: function() {
                alert('오류가 발생했습니다.');
            }
        });
    });
    
    // 검증 버튼 클릭 이벤트 핸들러
    $(document).on('click', '.prompt-verification-button', function() {
    	 $('#prompt-verification-modal').show();
    });
    
    // 시스템 프롬프트 선택 이벤트 핸들러 추가
    $('#promptlist').on('change', function() {
        selectedSystemPrompt = $(this).find('option:selected').map(function() {
            return $(this).text();
        }).get();
        selectedSystemPromptId = $(this).find('option:selected').map(function() {
            return $(this).val();
        }).get();
    });

    // 모달 닫기 버튼 이벤트 핸들러
    $(document).on('click', '.prompt-close-button', function() {
        $('#prompt-verification-modal').hide();
    });
    
    // 여기에 다른 이벤트 핸들러들을 추가할 수 있습니다.
}





function initializePagination(data, pageSize) {
    var pageCount = Math.ceil(data.length / pageSize);
    var $pagination = $(".pagination");

    $pagination.empty().off('click').on('click', 'li', function() {
        var $this = $(this);
        if($this.hasClass('disabled')) {
            return false;
        }
        var newPage = $this.data('page');
        if(newPage === 'prev') {
            currentPage = Math.max(currentPage - 1, 1);
        } else if(newPage === 'next') {
            currentPage = Math.min(currentPage + 1, pageCount);
        } else {
            currentPage = newPage;
        }
        displayPage(currentPage, data, pageSize);
        updatePaginationButtons($pagination, pageCount);
    });

    // 페이지네이션 버튼 추가 (이전, 숫자, 다음)
    addPaginationButtons($pagination, pageCount);

    // 페이지네이션 버튼 상태 업데이트
    updatePaginationButtons($pagination, pageCount);
}

function addPaginationButtons($pagination, pageCount) {
    $pagination.append('<li class="page-item" data-page="prev"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
    for (var i = 1; i <= pageCount; i++) {
        $pagination.append('<li class="page-item" data-page="' + i + '"><a class="page-link" href="#">' + i + '</a></li>');
    }
    $pagination.append('<li class="page-item" data-page="next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
}

function updatePaginationButtons($pagination, pageCount) {
    $pagination.find('li').removeClass('active disabled');
    $pagination.find('li').eq(currentPage).addClass('active');
    if(currentPage === 1) {
        $pagination.find('li[data-page="prev"]').addClass('disabled');
    }
    if(currentPage === pageCount) {
        $pagination.find('li[data-page="next"]').addClass('disabled');
    }
}


function displayPage(page, data, pageSize) {
	var start = (page - 1) * pageSize;
	var end = start + pageSize;
	var $tableBody = $("#prompt-table tbody").empty();
	var headers = getHeaders();

	data.slice(start, end).forEach(function(item) {
		var row = $('<tr/>').append(getCheckboxCell(item.promptId));
		headers.forEach(function(header) {
			row.append(getTableCell(item, header));
		});
		$tableBody.append(row);
	});
}

function filterAndDisplayData() {
    var selectedModel = $('#search-model-list').val();
    var filteredData = window.allPromptData.filter(function(item) {
        return selectedModel === 'all' || item.model === selectedModel;
    });

    initializePagination(filteredData, pageSize);
    displayPage(1, filteredData, pageSize);
}

function ajaxCall(method, url, data, successCallback, errorCallback) {
	$.ajax({
		type: method,
		url: url,
		data: data,
		success: successCallback,
		error: errorCallback
	});
}

function getHeaders() {
	return $("#prompt-table thead th").map(function() {
		return {
			field: $(this).data('field'),
			class: $(this).attr('class')
		};
	}).get().filter(header => header.field);
}

function getCheckboxCell(value) {
	return $('<td/>').append($('<input />', {
		type: 'checkbox',
		class: 'prompt-checkbox',
		name: 'selection',
		value: value
	}));
}

function getTableCell(item, header) {
    var cellValue = item[header.field] || '';
    var cell = $('<td/>').addClass(header.class);

    if (header.field === "verification") {
        return cell.html('<button type="button" class="btn prompt-verification-button">검증</button>');
    } else if (header.field === "useYN") {
    	var buttonText = cellValue === 'Y' ? '사용' : '미사용';
        var buttonClass = cellValue === 'Y' ? 'btn btn-success' : 'btn btn-secondary';
        // Hidden input 추가
        var hiddenInput = '<input type="hidden" class="useYN-value" value="' + cellValue + '">';
        return cell.html('<button type="button" id="prompt-useyn-button" class="' + buttonClass + '">' + buttonText + '</button>' + hiddenInput);
    }  else if (header.field === "parmJson") {
        // JSON 데이터를 파싱하여 'parameterName: defaultValue' 형식으로 변환
    	   var formattedData = '';
    	    var originalJson = '';
    	    try {
    	        var jsonData = JSON.parse(cellValue);
    	        var formattedParts = [];
    	        originalJson = cellValue; // 원본 JSON 데이터를 저장

    	        Object.keys(jsonData).forEach(function(key) {
    	            var param = jsonData[key];
    	            formattedParts.push(param.parameterName + ': ' + param.defaultValue);
    	        });

    	        formattedData = formattedParts.join(', ');

    	    } catch (e) {
    	        formattedData = 'Invalid JSON';
    	    }
    	    // 숨겨진 필드에 원본 JSON 데이터 저장
    	    var hiddenInput = '<input type="hidden" class="original-parmJson" value=\'' + originalJson + '\'>';
    	    // cell에 숨겨진 필드와 파싱된 데이터를 모두 추가
    	    return cell.html(hiddenInput + formattedData);
    	} else {
    	    return cell.text(cellValue);
    	}
}



/*
 * 프롬프트 삭제 이벤트
 */
function deleteSelectedPrompts() {
	var selectedPromptIds = getSelectedPromptIds();

	if (selectedPromptIds.length === 0) {
		alert('삭제할 항목을 선택해주세요.');
		return;
	}

	deletePrompts(selectedPromptIds, function(success) {
		if (success) {
			removeDeletedPromptsFromTable(selectedPromptIds);
		} else {
			alert('삭제에 실패했습니다.');
		}
	});
}

function getSelectedPromptIds() {
	return $('.prompt-checkbox:checked').map(function() {
		return $(this).val();
	}).get();
}

function deletePrompts(promptIds, callback) {
	$.ajax({
		type: 'POST',
		url: 'promptmanager/deletePromptMasterById.do',
		traditional: true,
		data: { 'promptId': promptIds },
		success: function(response) {
			callback(response > 0);
		},
		error: function() {
			callback(false);
		}
	});
}

function removeDeletedPromptsFromTable(promptIds) {
	promptIds.forEach(function(id) {
		$('input[value="' + id + '"]').closest('tr').remove();
	});
}

//검증화면에 프롬프트 선택 데이터 가져오기

function loadSystemPrompts() {
    $.ajax({
        type: "POST",
        url: "getPromptSystemInfo.do",
        async: false,
        success: function(data) {
            data.forEach(function(item) {
                var option = new Option(item.systemPromptName, item.systemPromptId);
                $promptList.append($(option));
                systemPromptJsonById[item.systemPromptId] = item;
            });

            $promptList.select2({
                placeholder: '프롬프트를 선택해 주세요',
                multiple: true
            });
        },
        error: function() {
            alert("시스템 프롬프트를 가져오는 데 실패했습니다.");
        }
    });
}

/*
 * 검증 팝업에서 테스트 버튼 클릭 시 발생하는 이벤트
 */
$('.prompt-test-button').on('click', function() {
// alert('검증을 시작합니다.');

    var requestParam = new Object();
    requestParam.model = $('.model-area .model').text();
    requestParam.prompt = $('.test-prompt-area .prompt-edit-text').val();
    
    //TODO 
    requestParam.system_prompt = '반말';
    requestParam.properties = { max_token: '500' };
    
    
    requestParam.file_path_list = "";
    requestParam.additional_work = "";
    
    data = {
        requestParam: JSON.stringify(requestParam),
        promptTestId: $('.prompt-test-id-area .promptTestId').text(),
        promptId: $('.prompt-Id-area .promptId').text(),
        promptVer: $('.prompt-Ver-area .promptVer').text(),
    };

    ajaxCall("POST", 'promptmanager/getPromptTestDataResultById.do', data,
        function(data) {

            var tbody = document.querySelector('.rate-table tbody');

            data.forEach(function(item) {
            	
            	console.log("item: ",item)
            	
                var row = document.createElement('tr');

                // 클로저를 사용하여 item 변수를 접근할 수 있도록 함
                $(row).data('item', item);

                // 각 열(td)에 데이터 추가
                var testIdCell = document.createElement('td');
                testIdCell.textContent = item.prompt_id;
                row.appendChild(testIdCell);

                // FIXME
                var changesCell = document.createElement('td');
                changesCell.textContent = '';
                row.appendChild(changesCell);

                var accuracyCell = document.createElement('td');
                accuracyCell.textContent = item.answer_cosine_similarity;
                row.appendChild(accuracyCell);

                // tbody에 행 추가
                tbody.appendChild(row);
            });



        },
        function() {
            alert("테스트 데이터 검증 실패.");
        }
    );
});


// 검증 시 오른쪽에 상세 화면 띄우기
$('.rate-table tbody').on('click', 'tr', function() {
    // 클릭한 행에서 데이터 가져오기
    var item = $(this).data('item');
    console.log("clicked item: ", item);

    // 가져온 데이터를 response-table에 추가
    var newRow = $('<tr>');
    newRow.append($('<td>').text(item.question));
    newRow.append($('<td>').text(item.answer));
    newRow.append($('<td>').text(item.prompt_result));
    newRow.append($('<td>').text((item.answer_cosine_similarity > 0.2) ? 'O' : 'X'));
    
    var checkboxTd = $('<td>');
    var checkbox = $('<input>', { type: 'checkbox', disabled: item.answer_cosine_similarity > 0.2 });
    
    if (item.answer_cosine_similarity <= 0.2 && item.answer_cosine_similarity !== null) {
        checkbox.prop('checked', true);
    }
    
    checkboxTd.append(checkbox);
    newRow.append(checkboxTd);

    // response-table의 tbody에 새로운 행 추가
    $('.response-table tbody').html(newRow);
});




/*
 * 검증 팝업에서 프롬프트 마스터 데이터 띄우기
 */
$(document).on('click', '.prompt-verification-button', function() {

    // 클릭된 버튼에 해당하는 데이터를 가져오는 로직을 여기에 추가합니다.
    var rowData = {};
    $(this).closest('tr').find('td').each(function() {
        var columnClass = $(this).attr('class');
        var columnData = $(this).text();
        rowData[columnClass] = columnData;
    });
    
	console.log('rowData: ',rowData);

    
	$('.prompt-Id-area .promptId').text(rowData.promptId);
	$('.prompt-test-id-area .promptTestId').text(rowData.promptTestId);
	$('.prompt-Ver-area .promptVer').text(rowData.promptVer);
	$('.model-area .model').text(rowData.model);
	$('.test-prompt-area .prompt-edit-text').text(rowData.prompt);
	$('.sys-prompt-etc-area .sysPromptEtc').text(rowData.sysPromptEtc);

	

	// TODO 파라미터, 시스템 프롬프트 선택
//	$('.parmJson-area .paramJson').text(rowData.model);
	
	// 프로그레스 바 생성
    var parmJson = JSON.parse($(this).closest('tr').find('.original-parmJson').val()); // 숨겨진 필드의 값을 읽어옵니다.
    if (parmJson) {
        var paramContainer = document.querySelector('.parmJson-area .paramJson');
        paramContainer.innerHTML = ''; // 기존 내용을 비웁니다.

        Object.keys(parmJson).forEach(function(key, index) {
            createParam(paramContainer, parmJson[key], key, index);
        });
    }
});

function createParam(paramContainer, json, key, index) {
    var defaultValue = json.defaultValue || 0;
    var minValue = json.minValue || 0;
    var maxValue = json.maxValue || 100;

    var newParamDiv = document.createElement('div');
    newParamDiv.classList.add('testparam');
    newParamDiv.innerHTML = `
        <div class="testparam-1">
            <div class="testparamtitle">${key}</div>
            <div class="testprograss">
                <input type="range" class="testparambar" id="testparambar-${index}" value="${defaultValue}"
                    min="${minValue}" max="${maxValue}">
                <input type="text" class="testparamInput" id="testparamInput-${index}" value="${defaultValue}">
            </div>
        </div>`;
    paramContainer.appendChild(newParamDiv);

    var progressBar = newParamDiv.querySelector('.testparambar');
    var textInput = newParamDiv.querySelector('.testparamInput');

    progressBar.addEventListener('input', function() {
        textInput.value = this.value;
    });
}

	
	
	// test history 가져오기
	console.log($('.prompt-Id-area .promptId').text())
	ajaxCall("POST", 'promptmanager/getPromptRateHistoryByPromptId.do', {promptId: $('.prompt-Id-area .promptId').text()},
	        function(data) {

	            var tbody = document.querySelector('.rate-table tbody');

	            data.forEach(function(item) {

	            	var row = document.createElement('tr');
	                // 클로저를 사용하여 item 변수를 접근할 수 있도록 함
	                $(row).data('item', item);

	                // 각 열(td)에 데이터 추가
	                var testIdCell = document.createElement('td');
	                testIdCell.textContent = item.promptRateHistId;
	                row.appendChild(testIdCell);

	                // FIXME
	                var changesCell = document.createElement('td');
	                changesCell.textContent = '';
	                row.appendChild(changesCell);

	                var accuracyCell = document.createElement('td');
	                accuracyCell.textContent = item.promptRate;
	                row.appendChild(accuracyCell);

	                // tbody에 행 추가
	                tbody.appendChild(row);
	            });



	        },
	        function() {
	            alert("프롬프트 테스트 히스토리 가져오기 실패.");
	        });
	



