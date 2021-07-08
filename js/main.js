{
  const attractionsList = document.querySelector(".js-attractionsList");
  const selectForm = document.querySelector(".js-selectForm");
  const paginationList = document.querySelector(".js-pagination");
  const countryTitleTag = document.querySelector(".js-countryName");
  const hotList = document.querySelector(".js-hotList");
  const scrollTopBtn = document.querySelector(".js-scrollTopBtn");

  const maxAttractionAmountInOnePage = 8;
  const pageRange = 10;
  const zipCode2countries = {
    800: "新興",
    801: "前金",
    802: "苓雅",
    803: "鹽埕",
    804: "鼔山",
    805: "旗津",
    806: "前鎮",
    807: "三民",
    811: "楠梓",
    812: "小港",
    813: "左營",
    814: "仁武",
    815: "大社",
    820: "岡山",
    821: "路竹",
    822: "阿蓮",
    823: "田寮",
    824: "燕巢",
    825: "橋頭",
    826: "梓官",
    827: "彌陀",
    828: "永安",
    829: "湖內",
    830: "鳳山",
    831: "大寮",
    832: "林園",
    833: "鳥松",
    840: "大樹",
    842: "旗山",
    843: "美濃",
    844: "六龜",
    845: "內門",
    846: "杉林",
    847: "甲仙",
    848: "桃源",
    849: "那瑪夏",
    851: "茂林",
    852: "茄定",
  };

  let attractions = null;
  let attractionsInCountry = null;

  //  Function

  const isNumber = (str) => {
    return !isNaN(str);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const getAttractionInfo = (data) => {
    return data.map((ele) => {
      return {
        name: ele.Name,
        address: ele.Add,
        country: `${zipCode2countries[ele.Zipcode]}區`,
        openTime: ele.Opentime,
        phone: ele.Tel,
        ticketInfo: ele.Ticketinfo,
        imageSrc: ele.Picture1,
      };
    });
  };

  const getAttractionByCountry = (attractions, country) => {
    if (country === "高雄市") {
      return attractions;
    }
    return attractions.filter((element) => element.country === country);
  };

  const getTotalPage = (totalAttractionAmount) => {
    return Math.ceil(totalAttractionAmount / maxAttractionAmountInOnePage);
  };

  const setPagination = (currentPage, totalPage) => {
    const part = Math.floor(currentPage / pageRange);
    const start = pageRange * part + 1;
    const end =
      pageRange * (part + 1) > totalPage ? totalPage : pageRange * (part + 1);

    let str = "";

    if (currentPage != 1) {
      str += `<li class="page-item"><a href="#">Prev</a></li>`;
    }
    for (let i = start; i <= end; i++) {
      if (i === currentPage) {
        str += `<li class="page-item active"><a href="#">${i}</a></li>`;
      } else {
        str += `<li class="page-item"><a href="#">${i}</a></li>`;
      }
    }
    if (currentPage != totalPage) {
      str += `<li class="page-item"><a href="#">Next</a></li>`;
    }
    paginationList.innerHTML = str;
  };

  const setSelectFormOptions = (selectForm, data) => {
    const defaultOptionTag = document.createElement("option");
    defaultOptionTag.value = "高雄市";
    defaultOptionTag.innerHTML = "高雄市";
    selectForm.appendChild(defaultOptionTag);

    data.forEach((element) => {
      const optionTag = document.createElement("option");
      const str = `${element}區`;
      optionTag.value = str;
      optionTag.innerHTML = str;
      selectForm.appendChild(optionTag);
    });
  };

  const showAttractions = (attractions) => {
    attractionsList.innerHTML = "";

    attractions.forEach((element) => {
      attractionsList.innerHTML += `
      <li class="card">
            <div class="card__header" style="background-image : url(${element.imageSrc})">
                <div class="card__title">
                    <h3>${element.name}</h3>
                    <p class="country">${element.country}</p>
                </div>
            </div>
            <div class="card__body">
                <div class="time info-item">
                    <img
                        src="./img/icons_clock.png"
                        alt="time icon"
                    >
                    <p>
                        ${element.openTime}
                    </p>
                </div>
                <div class="address info-item">
                    <img
                        src="./img/icons_pin.png"
                        alt="address icon"
                    >
                    <p>
                       ${element.address}
                    </p>
                </div>
                <div class="tel info-item">
                    <img
                        src="./img/icons_phone.png"
                        alt="tel icon"
                    >
                    <p>
                        ${element.phone}
                    </p>
                </div>
                <div class="ticker info-item">
                    <img
                        src="./img/icons_tag.png"
                        alt="tag icon"
                    >
                    <p>
                        ${element.ticketInfo}
                    </p>
                </div>
            </div>
        </li>
      `;
    });
  };

  // Main

  fetch(
    "https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c"
  )
    .then((res) => {
      return res.json();
    })
    .then((jsonData) => {
      const data = jsonData.data.XML_Head.Infos.Info;
      attractions = getAttractionInfo(data);

      countryTitleTag.textContent = selectForm.value;
      attractionsInCountry = getAttractionByCountry(
        attractions,
        selectForm.value
      );

      const totalPage = getTotalPage(attractionsInCountry.length);
      setPagination(1, totalPage);

      showAttractions(
        attractionsInCountry.slice(0, maxAttractionAmountInOnePage)
      );
    })
    .catch((err) => {
      throw err;
    });

  setSelectFormOptions(selectForm, Object.values(zipCode2countries));

  window.addEventListener("scroll", (event) => {
    if (window.pageYOffset > 350) {
      scrollTopBtn.classList.remove("hide");
    } else {
      scrollTopBtn.classList.add("hide");
    }
  });

  selectForm.addEventListener("change", (event) => {
    const country = event.target.value;

    countryTitleTag.textContent = country;

    attractionsInCountry = getAttractionByCountry(attractions, country);
    const totalPage = getTotalPage(attractionsInCountry.length);
    setPagination(1, totalPage);
    showAttractions(
      attractionsInCountry.slice(0, maxAttractionAmountInOnePage)
    );
  });

  paginationList.addEventListener("click", (event) => {
    event.preventDefault();

    const currentNode = event.target;
    const currentNodeName = currentNode.nodeName;

    if (currentNodeName !== "A" && currentNodeName !== "LI") {
      return;
    }

    scrollToTop();

    const content = currentNode.textContent;
    let targetPageNumber = null;

    if (!isNumber(content)) {
      const currentPageNode = document.querySelector(".page-item.active");
      const currentPageNumber = parseInt(currentPageNode.textContent);

      if (content === "Next") {
        targetPageNumber = currentPageNumber + 1;
      } else {
        targetPageNumber = currentPageNumber - 1;
      }
    } else {
      targetPageNumber = parseInt(content);
    }

    const totalPage = getTotalPage(attractionsInCountry.length);
    setPagination(targetPageNumber, totalPage);

    const start = (targetPageNumber - 1) * maxAttractionAmountInOnePage;
    const end = targetPageNumber * maxAttractionAmountInOnePage;
    showAttractions(attractionsInCountry.slice(start, end));
  });

  hotList.addEventListener("click", (event) => {
    event.preventDefault();
    const currentNode = event.target;
    const currentNodeName = currentNode.nodeName;

    if (currentNodeName !== "A" && currentNodeName !== "LI") {
      return;
    }

    const country = currentNode.textContent.trim();

    selectForm.value = country;

    countryTitleTag.textContent = country;

    attractionsInCountry = getAttractionByCountry(attractions, country);

    const totalPage = getTotalPage(attractionsInCountry.length);
    setPagination(1, totalPage);
    showAttractions(
      attractionsInCountry.slice(0, maxAttractionAmountInOnePage)
    );
  });

  scrollTopBtn.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToTop();
  });
}
