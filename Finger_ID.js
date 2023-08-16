var myVar;
function myFunction() {
  myVar = setTimeout(showPage, 100);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

  // Your web app's Firebase configuration
  // var firebaseConfig = {
  //   apiKey: "AIzaSyB00OSaTuZQ_9wXr-eAooDInrF_kFpULF4",
  //   authDomain: "diemdanh-fingerprint.firebaseapp.com",
  //   projectId: "diemdanh-fingerprint",
  //   storageBucket: "diemdanh-fingerprint.appspot.com",
  //   messagingSenderId: "641565700616",
  //   appId: "1:641565700616:web:c865dcb1ffa638a3a257bd",
  //   measurementId: "G-8CJ1K4RBN3"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);

var HovaTen;
var Ngaysinh;
var LopHoc;
var Add_ID;
function Add(){
  //Lấy dữ liệu từ các textbox
Add_ID=document.getElementById("Add_ID").value;
Add_ID=parseInt(Add_ID);
HovaTen=document.getElementById("Name").value;
Ngaysinh=document.getElementById("Date").value;
LopHoc=document.getElementById("Place").value;
//Check đã tồn tại ID này hay chưa ?
firebase.database().ref("ID"+Add_ID).once("value").then(function(snapshot){
  var a = snapshot.exists();
  console.log(a);
  //Nếu tồn tại rồi
  if(a==true)
  {
    document.getElementById("test").innerHTML="Đã tồn tại ID này";
  }
  else // Nếu chưa tồn tại
  {
    firebase.database().ref("ID_ADD").set(Add_ID);
    firebase.database().ref("ID"+Add_ID).update({
          "ID":Add_ID
    });
        firebase.database().ref("ID"+Add_ID).update({
          "Check":0
    });
    firebase.database().ref("ID"+Add_ID).update({
          "Họ và Tên":HovaTen
    });
    firebase.database().ref("ID"+Add_ID).update({
          "Ngày Sinh":Ngaysinh
    });
    firebase.database().ref("ID"+Add_ID).update({
          "Lớp Học":LopHoc
    });    
    document.getElementById("test").innerHTML="Đã thêm ID này";
  }
})
}
//Time
var d = new Date();
var s; //giay clock
var m; // phut clock
var h; // gio clock
var ngay;
var thang;
var nam;
function time(){
d = new Date();
h=d.getHours();
m=d.getMinutes();
s=d.getSeconds();
ngay=d.getDate();
thang=d.getMonth()+1;
nam=d.getFullYear();
m1=checktime(m);
s1=checktime(s);
document.getElementById("hours").innerHTML=h+":";
document.getElementById("minutes").innerHTML=m1+":";
document.getElementById("seconds").innerHTML=s1;
var t=setTimeout(time, 50);
}
function checktime(q)
{
  if(q<10)
    {q="0"+q};
  return q;
}

//Hàm Kiểm Tra
function kiemtra()
{
Check_ID=document.getElementById("Check_ID").value;
Check_ID=parseInt(Check_ID);
  for(let i = 0; i< 11; i++)
  {
    for(let j=0;j<13;j++)
    {
      for(let k=0;k<31;k++)
        firebase.database().ref("History_Check"+"/Năm_202"+i+"/Tháng_"+j+"/Ngày_"+k+"/ID"+Check_ID).once("value").then(function(snapshot){
       var a = snapshot.exists();
       console.log(a);
        if(a==true){
            var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
            var newRow   = tableRef.insertRow();
              document.getElementById("check").innerHTML="Tiến hành điểm danh";
            //Chèn vào một bộ thông tin
            //Chèn ngày sinh
                  var newCell  = newRow.insertCell(0);
                  var newText  = document.createTextNode("202"+i+"-"+j+"-"+k);
                  newCell.appendChild(newText);
            //Chèn ID
                    firebase.database().ref('ID'+Check_ID+'/ID').on("value",function(snapshot){
                      var text=snapshot.val();
                      console.log(text);
                      //Chèn vào hàng tiếp theo cột thứ nhất
                      var newCell  = newRow.insertCell(1);
                      var newText  = document.createTextNode("ID"+text);
                      newCell.appendChild(newText);
                  });
            //Chèn Họ tên
                  firebase.database().ref('ID'+Check_ID+'/Họ và Tên').on("value",function(snapshot){
                  var text=snapshot.val();
                  console.log(text);
                  //Chèn vào hàng tiếp theo cột thứ nhất
                  var newCell  = newRow.insertCell(2);
                  var newText  = document.createTextNode(text);
                  newCell.appendChild(newText);
              });
            //
            //Chèn giờ vào
            firebase.database().ref("History_Check"+"/Năm_202"+i+"/Tháng_"+j+"/Ngày_"+k+"/ID"+Check_ID+"/Giờ vào").once("value").then(function(snapshot){
            var st1 = snapshot.val();
            firebase.database().ref("History_Check"+"/Năm_202"+i+"/Tháng_"+j+"/Ngày_"+k+"/ID"+Check_ID+"/Phút vào").once("value").then(function(snapshot){
            var st2 = snapshot.val();
                        var text=st1+"h"+st2
            var newCell  = newRow.insertCell(3);
            var newText  = document.createTextNode(text);
            newCell.appendChild(newText);
            });
            });
            //Chèn giờ ra
            firebase.database().ref("History_Check"+"/Năm_202"+i+"/Tháng_"+j+"/Ngày_"+k+"/ID"+Check_ID+"/Giờ ra").once("value").then(function(snapshot){
            var str3 = snapshot.val();
            firebase.database().ref("History_Check"+"/Năm_202"+i+"/Tháng_"+j+"/Ngày_"+k+"/ID"+Check_ID+"/Phút ra").once("value").then(function(snapshot){
            var str4 = snapshot.val();
                        var text=str3+"h"+str4
            var newCell  = newRow.insertCell(4);
            var newText  = document.createTextNode(text);
            newCell.appendChild(newText);
            });
            });
        }
      });
    }
  }
}
// firebase.database().ref('ID').on("value",function(snapshot){
// var vantay_now=snapshot.val();
// if(vantay_now>0)
// {
//   firebase.database().ref('ID'+vantay_now+'/Check').once("value").then(function(snapshot){
//   var a = snapshot.val();
//   console.log(a)
//   if(a==1)
//   {
//         firebase.database().ref("/History_Check"+"/Năm_"+nam+"/Tháng_"+thang+"/Ngày_"+ngay+"/ID"+vantay_now).update({
//         "Giờ vào":h,
//         "Phút vào":m
//     });
//   }
//   else
//   {
//     firebase.database().ref("/History_Check"+"/Năm_"+nam+"/Tháng_"+thang+"/Ngày_"+ngay+"/ID"+vantay_now).update({
//         "Giờ ra":h,
//         "Phút ra":m
//     });
//   }
//   });
// }
// });
//Xoa ID
function xoaid()
{
    var Xoa_ID;
    Xoa_ID=document.getElementById("Xoa_ID").value;
    Xoa_ID=parseInt(Xoa_ID);
    firebase.database().ref("ID_Xoa").set(Xoa_ID);
    firebase.database().ref('ID'+Xoa_ID).remove();
    for(let soid=0;soid<11;soid++)
    {
      for(let sothang=0;sothang<13;sothang++)
      {
        for(let songay=0;songay<31;songay++)
        {
          firebase.database().ref("History_Check"+"/Năm_202"+soid+"/Tháng_"+sothang+"/Ngày_"+songay+"/ID"+Xoa_ID).once("value").then(function(snapshot){
         var a = snapshot.exists();
         if(a==true)
         {
          firebase.database().ref("History_Check"+"/Năm_202"+soid+"/Tháng_"+sothang+"/Ngày_"+songay+"/ID"+Xoa_ID).remove();
         }
          });
        }
      }
    }
    document.getElementById("test").innerHTML="Đã Xóa ID này";
}

function tracuuID()
{
  var tracuuID = document.getElementById("tracuu").value;
  tracuuID=parseInt(tracuuID);
firebase.database().ref("ID"+tracuuID).once("value").then(function(snapshot){
  var a = snapshot.exists();
  console.log(a);
  //Nếu tồn tại rồi
  if(a==true)
  {
    document.getElementById("text").innerHTML = "đã tìm ra ID"
    var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
    var newRow   = tableRef.insertRow();
    firebase.database().ref("ID"+tracuuID+"/ID").once("value").then(function(snapshot){
      var ID = snapshot.val();
      var newCell  = newRow.insertCell(0);
      var newText  = document.createTextNode(ID);
      newCell.appendChild(newText);
    })
    firebase.database().ref("ID"+tracuuID+"/Họ và Tên").once("value").then(function(snapshot){
      var HoTen = snapshot.val();
      var newCell  = newRow.insertCell(1);
      var newText  = document.createTextNode(HoTen);
      newCell.appendChild(newText);
    })
    firebase.database().ref("ID"+tracuuID+"/Ngày Sinh").once("value").then(function(snapshot){
      var Ngay_sinh = snapshot.val();
      console.log(Ngaysinh);
            var newCell  = newRow.insertCell(2);
      var newText  = document.createTextNode(Ngay_sinh);
      newCell.appendChild(newText);
    })
    firebase.database().ref("ID"+tracuuID+"/Lớp Học").once("value").then(function(snapshot){
      var LopHoc = snapshot.val();
      
            var newCell  = newRow.insertCell(3);
      var newText  = document.createTextNode(LopHoc);
      newCell.appendChild(newText);
    })
  }

  else // Nếu chưa tồn tại
  {
    document.getElementById("text").innerHTML = "Chưa tồn tại ID này"
  }
})   


}

// var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
// var newRow   = tableRef.insertRow();
// //Chèn vào hàng tiếp theo cột thứ nhất
// var newCell  = newRow.insertCell(0);
// var newText  = document.createTextNode('New row');
// newCell.appendChild(newText);