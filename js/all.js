// import axios from "../node_modules/axios/dist/esm/axios.js"; 原本使用npm安裝axios

let data;
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
  )
  .then(function (response) {
    data = response.data.data;
    render(data);
  })
  .catch(function (error) {
    console.log(error);
  });

//渲染初始化
const list = document.querySelector(".list");
function render(renderData) {
  let str = "";
  let areaCount={};
  renderData.forEach(function (item) {
    str += `<div class="col-12 col-md-6 col-lg-4">
    <div class="card border-0 shadow h-100 position-relative">
      <div class="badge position-absolute bg-info px-4 py-3 fs-5 rounded-0 rounded-end translate-middle-y top-3">${item.area}</div>
      <img src="${item.imgUrl}" alt="${item.name}" class="card-img-top">
      <div class="card-body position-relative">
        <div class="badge position-absolute bg-primary translate-middle-y top-0 start-0 rounded-0 rounded-end p-2">${item.rate}</div>
        <h3 class="card-title text-primary fw-bold border-bottom border-primary pb-1 h4 mt-2">${item.name}</h3>
        <p class="text-secondary mb-0">${item.description}</p>
      </div>
      <div class="card-footer bg-white border-0">
        <div class="row align-items-center">
          <div class="col">
            <p class="text-primary fw-bold mb-0"><i class="bi bi-exclamation-circle-fill me-1"></i>剩下最後 ${item.group} 組</p>
          </div>
          <div class="col">
            <p class="text-primary fw-bold mb-0 fs-2 text-end"><span class="fs-6 me-1">TWD</span>$${item.price}</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  list.innerHTML = str;

  if(areaCount[item.area]===undefined){
    areaCount[item.area]=1;
  }else{
    areaCount[item.area]++;
  }
  });  
  
  // let columnsAry=[
  //   [Object.keys(areaCount)[0],Object.values(areaCount)[0]],
  //   [Object.keys(areaCount)[1],Object.values(areaCount)[1]],
  //   [Object.keys(areaCount)[2],Object.values(areaCount)[2]],
  // ]
  let columnsAry=[];
  Object.keys(areaCount).forEach(function(item){
    columnsAry.push([item,areaCount[item]]);
  })

  //C3 圖表
var chart = c3.generate({
  data: {
      // iris data from R
      columns: columnsAry,
      type : 'pie',
      onclick: function (d, i) { console.log("onclick", d, i); },
      onmouseover: function (d, i) { console.log("onmouseover", d, i); },
      onmouseout: function (d, i) { console.log("onmouseout", d, i); }
  }
});

}

//新增套票
const form=document.querySelector(".form");
const name = document.querySelector(".tickets-name");
const imgUrl = document.querySelector(".tickets-imgUrl");
const area = document.querySelector(".tickets-area");
const price = document.querySelector(".tickets-price");
const group = document.querySelector(".tickets-group");
const rate = document.querySelector(".tickets-rate");
const description = document.querySelector(".tickets-description");
const addBtn = document.querySelector(".add-btn");
addBtn.addEventListener("click", function (e) {
  if (
    name.value == "" ||
    imgUrl.value == "" ||
    area.value == "" ||
    price.value == "" ||
    group.value == "" ||
    rate.value == "" ||
    description.value == ""
  ) {
    alert("欄位不可為空白");
  } else if (price.value <= 0 || group.value <= 0 || rate.value <= 0) {
    alert("輸入數值錯誤");
  } else if(description.value.trim().length>100){
    alert("套票描述超過100字");
  }else {
    let obj = {
      id: data.length,
      name: name.value.trim(),
      imgUrl: imgUrl.value.trim(),
      area: area.value,
      price: parseInt(price.value.trim()),
      group: parseInt(group.value.trim()),
      rate: parseInt(rate.value.trim()),
      description: description.value.trim(),
    };
    data.push(obj);
    render(data);
    form.reset();
  }
});

//篩選套票
const filter=document.querySelector(".filter");
const filterNum=document.querySelector(".filter-num");
const chart=document.querySelector("#chart");
filter.addEventListener("change",function(e){
  let filterData=[];
  let areaData=[];
  let str="";
  data.forEach(function(item){
    areaData.push(item.area);   
  })
  data.filter(function(item){
    if(filter.value==="全部"){
      render(data);
      filterNum.textContent=`本次搜尋共 ${data.length} 筆資料`;
      chart.setAttribute("class","d-block");
    }else if(filter.value===item.area){
      filterData.push(item);
      render(filterData);
      filterNum.textContent=`本次搜尋共 ${filterData.length} 筆資料`;
      chart.setAttribute("class","d-block");
    }else if(areaData.includes(filter.value)===false){
      str=`<div class="col-12">
      <div class="row justify-content-center">
        <div class="col-6 position-relative">
          <p class="text-primary mb-0 fs-6 fs-lg-3 fw-bold position-absolute translate-middle top-28 start-41">查無此關鍵字</p>
          <img src="./images/no_found.png" alt="查無此關鍵字" class="img-fluid">
        </div>
      </div>
    </div>`;
    list.innerHTML=str;
    filterNum.textContent=`本次搜尋共 0 筆資料`;
    chart.setAttribute("class","d-none");
    }
  })
})