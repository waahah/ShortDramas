const config = {
    _event : 'click',
    _btn : '.api-button',
    _search : '#searchBtn',
    _list : [dailyUpdate, getAllShortDramas, dailyUpdateAndDownload]
}

function searchAPI() {
    // 清除“全部短剧”页面的查询结果
    allShortDramasData = [];
    currentPage = -1;
    document.getElementById('pagination').innerHTML = '';
    
    const searchText = document.getElementById('searchText').value;
    fetch(`https://zy.6789o.com/duanjuapi/search.php?text=${encodeURIComponent(searchText)}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            if (data.code === 200) {
                data.data.forEach(item => {
                    const name = item.name;
                    const viewLink = item.viewlink;
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result-item');
                    resultElement.innerHTML = `<strong>短剧名称：</strong> ${name}<br><strong>观看地址：</strong> <a href="${viewLink}" target="_blank">${viewLink}</a>`;
                    resultsDiv.appendChild(resultElement);
                });
            } else {
                resultsDiv.innerHTML = '搜索关键词资源名字不能为空';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('results').innerHTML = 'An error occurred while fetching data';
        });
}

async function threeDayUpdate(msg, callbackfunc) {
    const apiURL = "https://zy.6789o.com/duanjuapi/today3.php";

    await fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 错误！状态码：${response.status}`);
            }
            return response.json(); // 解析响应为 JSON
        })
        .then(data => {
            const ShortDramasData = data.data;
            msg = `${data.msg}：\r\n`;
            for (let obj of ShortDramasData) {
                msg += `剧名：${obj.name}，观看链接：${obj.viewlink}\r\n`
            }
            //console.log("获取到的数据：", data);
            callbackfunc("近日更新.txt", msg);
        })
        .catch(error => {
            console.error("发生错误：", error);
        });
}

function dailyUpdateAndDownload() {
    dailyUpdate();

    setTimeout(async() => {
        let content = "这里是近三天更新内容，可以根据实际情况修改"; 

        threeDayUpdate(content, downloadTxtFile);
        
    }, 100); // 等待2秒，确保更新完成后再生成文件并下载
}

function downloadTxtFile(filename, content) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // 兼容Firefox
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(file);
}

function dailyUpdate() {
    // 清除“全部短剧”页面的查询结果
    allShortDramasData = [];
    currentPage = -1;
    document.getElementById('pagination').innerHTML = '';
    
    fetch('https://zy.6789o.com/duanjuapi/today.php')
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // 清空先前的结果

            if (data.code === 1) {
                if (data.data && Array.isArray(data.data)) {
                    data.data.forEach(item => {
                        const name = item.name;
                        const viewLink = item.viewlink;

                        const resultElement = document.createElement('div');
                        resultElement.classList.add('result-item');
                        resultElement.innerHTML = `<strong>短剧名称：</strong> ${name}<br><strong>观看地址：</strong> <a href="${viewLink}" target="_blank">${viewLink}</a>`;
                        resultsDiv.appendChild(resultElement);
                    });
                } else {
                    resultsDiv.innerHTML = 'No daily update information available';
                }
            } else {
                resultsDiv.innerHTML = 'Daily update data not found';
            }
        })
        .catch(error => {
            console.error('Daily Update Error:', error);
            document.getElementById('results').innerHTML = 'An error occurred while fetching daily update data';
        });
}
               let currentPage = 1;
        const itemsPerPage = 20;
        let allShortDramasData = [];

        function displayResults() {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentPageData = allShortDramasData.slice(startIndex, endIndex);

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // 清空之前的结果

            currentPageData.forEach(item => {
                const name = item.name;
                const viewLink = item.viewlink;

                const resultElement = document.createElement('div');
                resultElement.classList.add('result-item');
                resultElement.innerHTML = `<strong>短剧名称：</strong> ${name}<br><strong>观看地址：</strong> <a href="${viewLink}" target="_blank">${viewLink}</a>`;
                resultsDiv.appendChild(resultElement);
            });

            updatePagination();
        }

        function updatePagination() {
            const totalPages = Math.ceil(allShortDramasData.length / itemsPerPage);
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            const prevArrow = createPaginationArrow('首页', currentPage > 1 ? currentPage - 1 : 1);
            paginationDiv.appendChild(prevArrow);
            
            let startPage = currentPage > 2 ? currentPage - 2 : 1;
            let endPage = startPage + 1 < totalPages ? startPage + 1 : totalPages;
            
            if (startPage > 1) {
                const firstPage = createPaginationLink(1);
                paginationDiv.appendChild(firstPage);
                if (startPage > 2) {
                    const ellipsis = createPaginationEllipsis();
                    paginationDiv.appendChild(ellipsis);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageLink = createPaginationLink(i);
                paginationDiv.appendChild(pageLink);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsis = createPaginationEllipsis();
                    paginationDiv.appendChild(ellipsis);
                }
                const lastPage = createPaginationLink(totalPages);
                paginationDiv.appendChild(lastPage);
            }

        }

        function createPaginationLink(pageNum) {
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = pageNum;
            pageLink.onclick = () => {
                currentPage = pageNum;
                displayResults();
            };
            return pageLink;
        }

        function createPaginationArrow(text, pageNum) {
            const pageArrow = document.createElement('a');
            pageArrow.classList.add('page-link');
            pageArrow.href = '#';
            pageArrow.textContent = text;
            pageArrow.onclick = () => {
                currentPage = pageNum;
                displayResults();
            };
            return pageArrow;
        }

        function createPaginationEllipsis() {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            return ellipsis;
        }

        function getAllShortDramas() {
            fetch('https://zy.6789o.com/duanjuapi/list.php')
                .then(response => response.json())
                .then(data => {
                    allShortDramasData = data.data;
                    currentPage = 1;
                    displayResults();
                })
                .catch(error => {
                    console.error('Get All Short Dramas Error:', error);
                    document.getElementById('results').innerHTML = 'An error occurred while fetching all short dramas data';
                });
        }
        
        document.querySelector(config._search).addEventListener(config._event, searchAPI);
        for (const key in config._list) {
            if (Object.prototype.hasOwnProperty.call(config._list, key)) {
                const fun = config._list[key];
                document.querySelectorAll(config._btn)[key].addEventListener(config._event, fun);
            }
        }
        
        