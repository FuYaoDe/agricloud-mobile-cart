
$( document ).delegate('#order', 'pagecreate', function() {
  $('div.ui-content', '#order').installContent();
  $('div[data-role=footer]', '#order').installGlobalFooter();
});


$( document ).delegate("#order", "pageshow", function() {
	$('#syncOrderHistory').bind('click',function(){
		$('#syncInfo').slideDown(300);
	});

  var showPurchaseList = function(list){
    $('#orderStatusList').empty();
    $.each(list, function (i) {
        try{
            $('#orderStatusList').append(
            '<li class=\"ui-li-has-thumb ui-last-child\" id='+ i +'>'+
                '<a href=\"#orderStatus\" rel=\"external\" class=\"ui-btn ui-btn-icon-right ui-icon-carat-r\">'+
                '<img src=\"img/blackcat.jpg\" />'+
                '<h3>雲端文旦禮盒</h3>'+
                '<p>訂單日期：'+ list[i].createdAt +'</p>'+
                '<p>金額：$'+ list[i].paymentTotalAmount +
                '元、配送地址：'+ list[i].Shipment.address +'</p>'+
            '</a></li>');
        }catch(e){

        }
    });
  };

  var urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results === null ? false : results[1];
  };

  $("#sendOrderSyncRequestForm").on('submit',function(e){
    console.log("~~~~~~~~~~~~");
    e.preventDefault();
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    $.ajax({
      url : formURL,
      type: "POST",
      data : postData,
      error: function () {
        alert('再確認一下喔，mail錯誤哟:)')
      },
      success:function(data, textStatus, jqXHR){
        console.log('success',data);
      }
    });
  });

  $("#orderStatusRequestForm").on('submit',function(e){
    e.preventDefault();
    console.log('=== getOrderStatusRequestBtn ===');
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");

    console.log(formURL);
    console.log(postData);
    $.ajax({
      url : formURL,
      type: "POST",
      data : postData,
      success:function(data, textStatus, jqXHR){
        var data = JSON.parse(data)
        localStorage['purchaseHistory'] = JSON.stringify(data.purchaseHistory);
        showPurchaseList(data.purchaseHistory);
      },
      error: function () {
        alert('再確認一下喔，驗證碼錯誤哟 :)')
      }
    });
  });


  console.log('~~~~~~~~~~~~~~~~~~');
  if(localStorage.purchaseHistory){
    var list = JSON.parse(localStorage["purchaseHistory"]);
    showPurchaseList(list);
  }

  var token = urlParam('token');
  if(token){
    $('#syncInfo').slideDown(300);
    $('#token').val(token);
  }

  $('#orderStatusList li').click(function() {
    var orderStatus = JSON.parse(localStorage["purchaseHistory"])[this.id];
    console.log(orderStatus);

    $('#orderStatus_id').text(orderStatus.serialNumber);

    $.each(orderStatus.OrderItems ,function(i){
      $('#orderItem').append(
        '<div data-role=\"fieldcontain\">'+
          '<label for=\"orderStatus_orderitem_name\">名稱:</label>'+
          '<span id=\"orderStatus_orderitem_name\"/>'+ orderStatus.OrderItems[i].name +
        '</div>'+

        '<div data-role=\"fieldcontain\">'+
          '<label for=\"orderStatus_orderitem_quantity\">數量:</label>'+
          '<span id=\"orderStatus_orderitem_quantity\"/>'+ orderStatus.OrderItems[i].quantity +
        '</div>');
    });
    $('#orderStatus_paymentTotalAmount').text(orderStatus.paymentTotalAmount);

    $('#orderStatus_user_username').text(orderStatus.User.username);
    $('#orderStatus_user_email').text(orderStatus.User.email);
    $('#orderStatus_user_mobile').text(orderStatus.User.mobile);
    $('#orderStatus_user_address').text(orderStatus.User.address);

    $('#orderStatus_shipment_username').text(orderStatus.Shipment.username);
    $('#orderStatus_shipment_email').text(orderStatus.Shipment.email);
    $('#orderStatus_shipment_mobile').text(orderStatus.Shipment.mobile);
    $('#orderStatus_shipment_address').text(orderStatus.Shipment.address);

  });

});
