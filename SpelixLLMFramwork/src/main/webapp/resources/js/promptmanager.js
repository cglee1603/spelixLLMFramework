$(document).ready(function(){

    $.ajax({
        type : "GET",
        url : "/promptmanager/getAllPromptMaster.do",
        success : function(data) {

            var pageSize = 10; // 페이지 당 행의 수
            var pageCount = Math.ceil(data.length / pageSize); // 총 페이지 수
            var currentPage = 1;

            // 페이지네이션 초기화
            $(".pagination").empty();

            // 페이지 번호 생성
            for(var i = 1 ; i <= pageCount; i++){
                $(".pagination").append('<li><a href="#">' + i + '</a></li>');
            }

            // 첫 페이지 로드
            displayPage(currentPage, data, pageSize);

            // 페이지 번호 클릭 이벤트
            $('.pagination').on('click', 'li', function() {
                currentPage = $(this).index() + 1;
                displayPage(currentPage, data, pageSize);
            });

            // 페이지에 데이터 표시
            function displayPage(page, data, pageSize) {
                var start = (page - 1) * pageSize;
                var end = start + pageSize;

                $("#prompt-table tbody").empty();

                // 헤더에서 class와 data-field 속성을 가져와서 headers 배열을 생성합니다.
                var headers = $("#prompt-table thead th").map(function(index) {
                    if (index > 0) { // 첫 번째 헤더는 체크박스라서 제외
                        return { field: $(this).data('field'), class: $(this).attr('class') };
                    }
                }).get();

                for (var i = start; i < end && i < data.length; i++) {
                    var row = $('<tr/>');

                    // 첫 번째 셀에 라디오 버튼 추가
                    $('<td/>').html('<input type="checkbox" name="selection" value="' + i + '" />').appendTo(row);

                    $.each(headers, function(index, header) {
                        var cellValue = data[i][header.field] || '';
                        $('<td/>').addClass(header.class).text(cellValue).appendTo(row);
                    });
                    $("#prompt-table tbody").append(row);
                }
            }

        },
        error : function() {
            alert("프롬프트 마스터를 가져오는 데 실패했습니다.");
        }
    });

});
