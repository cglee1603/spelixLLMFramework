var pageSize = 10;
var currentPage = 1; 
var modelNameTypeJson = {};
window.promptData = []; // 전역 변수로 프롬프트 데이터 저장

$(document).ready(function() {
	loadPromptModelList();
	loadPromptData();
	setupEventHandlers();
});

function loadPromptModelList() {
	var $modelSelect = $('#search-model-list');
	ajaxCall("POST", "promptmanager/getAllPromptModelList.do", {}, 
			function(data) {
		data.forEach(function(value) {
			var option = new Option(value.modelName, value.modelName);
			$modelSelect.append(option);
			modelNameTypeJson[value.modelName] = value.modelType;
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

//기존 setupEventHandlers 함수에 이벤트 핸들러 추가
function setupEventHandlers() {
	$('#select-all-checkbox').change(function() {
		$('.prompt-checkbox').prop('checked', $(this).is(':checked'));
	});

	$('.prompt-delete-button').click(deleteSelectedPrompts);

    $('#search-model-list').change(filterAndDisplayData);

    // 사용 여부 버튼에 대한 이벤트 핸들러 추가
    $(document).on('click', '.prompt-useyn-button', function() {
        var $button = $(this);
        var promptId = $button.closest('tr').find('.promptId').text();

        $.ajax({
            url: '/path/to/update', // 실제 서버의 URL로 변경
            method: 'POST',
            data: { id: promptId },
            success: function(response) {
                if(response === 'Y') {
                    $button.text('사용').removeClass('btn-secondary').addClass('btn-success');
                } else {
                    $button.text('미사용').removeClass('btn-success').addClass('btn-secondary');
                }
            },
            error: function() {
                alert('오류가 발생했습니다.');
            }
        });
    });
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
        return cell.html('<button type="button" class="' + buttonClass + '">' + buttonText + '</button>');
    }  else if (header.field === "parmJson") {
        // JSON 데이터를 파싱하여 'parameterName: defaultValue' 형식으로 변환
        var formattedData = '';
        try {
            var jsonData = JSON.parse(cellValue);
            Object.keys(jsonData).forEach(function(key) {
                var param = jsonData[key];
                formattedData += param.parameterName + ': ' + param.defaultValue + '<br>';
            });
        } catch (e) {
            formattedData = 'Invalid JSON';
        }
        return cell.html(formattedData);
    } else {
        return cell.text(cellValue);
    }
}



//프롬프트 삭제 이벤트
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

