$(document).ready(()=>{
    let nickname = "";
    let books = {};
    
      $("h1").show();    
    
    $("#div-input").show();
    
    //keyup enter name
    $('#nickname').keyup(function(e){
        if(e.key == "Enter")
      {
        if(e.target.value == ""){
          $('#nickname').addClass("text-danger");
        }else{
            nickname =  e.target.value;
          getData();
          $('#front-page').slideUp(1000);
          $('#main-page').fadeIn(2000);
        }
      }                
    });
    
    $('#add-data').click(function() {
       $('#main-page').hide();
       $('#detail-page').fadeIn(1000);
    });
    
    $('#detail-form').submit(function(e){
        e.preventDefault(); // supaya saat submit tidak pindah page
      if($('#book_name').val() == "" || $('#description').val() ==""){
            alert("Isi semua inputan");        
        //buat warna merah donk
      }
      else{
        if($('#book_id').val() == "") //add data
        {          
          $.ajax({
            url: "https://jquery.warastra-adhiguna.com/api/book?nickname=" +nickname,//ini adalah format url api utk create/post
            type: "POST",  // methodnya pakai post
            dataType: "json", // type data yg dikirim modelnya json
            data: { // data yang dikirm
              nickname:nickname, // nickname yg pertama adalah key utk object post, nickname kedua adl var
              book_name: $('#book_name').val(),
              description:$('#description').val(),
            },
            success: function (data) {
                swal("Tambah Data", "terimakasih sudah menambah data!", "success");
                $('#main-page').fadeIn();
                $('#detail-page').hide();
                getData();
                refreshTable();
            },
            error: function (error) {
                alert(error.message);
            },
          });
        } else {
          //TODO : 2) jquery update data, hilangkan detail, tampilkan main
          $.ajax({
            url: "https://jquery.warastra-adhiguna.com/api/book/" + $("#book_id").val(),
            type: "PUT",
            dataType: "json",
            data: {
              nickname,
              book_name:  $('#book_name').val(),
              description:  $('#description').val(),
            },
            success: function (data) {
              $('#detail-page').hide(); // Sembunyikan halaman detail
              $('#main-page').fadeIn(); // Tampilkan halaman utama
              getData();
              refreshTable();
              swal("Data Berhasil diUpdate", "terimakasih sudah memperbaiki!", "success");
            },
            error: function (error) {
              alert(error.message, "danger");
            },
          });
        }
      }
    });    
  
    $(".text-warning").click(() => {
      $('#detail-page').hide(); // Sembunyikan halaman detail
      $('#main-page').fadeIn(); // Tampilkan halaman utama
    });
    
    function refreshTable(){
      books.forEach(function(book, index){
        $("tbody").append("<tr><td>"+(index + 1)+"</td><td>"+book.book_name+"</td><td>"+book.description+"</td><td><button id='edit_"+ index +"' class='text-warning'>Edit</button><button id='delete_"+ index +"' class='text-danger'>delete</button></td></tr>");
        
      });
    }
    
    //harus pakai event delegation
    // row 1 buton id=edit_345
           $("tbody").on("click", ".text-warning", function () {
      let index = $(this).attr("id").split("_")[1];
      //displit dengan underscore, sehingga diambil 345nya
      $("#book_id").val(books[index].id); //isi input book_id dengan book.id
      $("#book_name").val(books[index].book_name); //isi input book_id dengan book.id
      $("#description").val(books[index].description); //isi input book_id dengan book.id
      
      //TODO : 1) TAMPILKAN DETAIL DATA, HILANGKAN MAINDATA
      $("#main-page").hide();
      $("#detail-page").fadeIn();
    });
    
      //TODO : 3) buat fungsi delete, getdata() dan refresh page()
      $("tbody").on("click", ".text-danger", function () {
        let index = $(this).attr("id").split("_")[1];
        let ID = books[index].id;
        $.ajax({
          url: "https://jquery.warastra-adhiguna.com/api/book/" + ID,
          type: "DELETE",
          data: {
            nickname,
            book_name:  $('#book_name').val(),
            description:  $('#description').val(),
          },
            success: function (data) {
                swal("Delete", "Data berhasil dihapus!", "success");
                refreshPage();
                getData();
            },
            error: function (error) {
                alert(error.message, "danger");
            },
          });
        });
    
    function getData(){
      $.ajax({
        url: "https://jquery.warastra-adhiguna.com/api/book?nickname=" + nickname,
        type: "GET",
        dataType: "json",
        success: function (result) {
                      books = result.data;
          refreshTable();
        },
        error: function (error) {
          alert("Terjadi kesalahan: ", error.message);
        },
      });      
    }

    function refreshTable() {
      $("tbody").empty(); // Kosongkan tbody sebelum menambahkan data baru
        books.forEach(function (book, index) {
          $("tbody").append("<tr><td>" + (index + 1) + "</td><td>" + book.book_name + "</td><td>" + book.description + "</td><td><button id='edit_" + index + "' class='text-warning'>Edit</button><button id='delete_" + index + "' class='text-danger'>Delete</button></td></tr>");
      });
    }


    function refreshPage() {
      // Clear existing table data
      $("tbody").empty();
        // Get updated data from server
        $.ajax({
          url: "https://jquery.warastra-adhiguna.com/api/book?nickname=" + nickname,
          type: "GET",
          dataType: "json",
          success: function (result) {
            books = result.data;
            resetDetailTable();
          },
          error: function (error) {
            alert("Terjadi kesalahan: ", error.message);
          },
        });
    }

    function resetDetailPage() {
          $("#book_id").val(""); // Mengosongkan nilai book_id
          $("#book_name").val(""); // Mengosongkan nilai book_name
          $("#description").val(""); // Mengosongkan nilai description
          $('#detail-page').hide(); // Sembunyikan halaman detail
          $('#main-page').show(); // Tampilkan halaman utama
    }
});