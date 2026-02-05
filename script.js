// Biến toàn cục để lưu dữ liệu
let allData = [];
let filteredData = [];

// Load dữ liệu từ db.json
async function loadData() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        allData = data.posts || [];
        filteredData = [...allData];
        displayData(filteredData);
    } catch (error) {
        console.error('Lỗi khi load dữ liệu:', error);
        document.getElementById('noData').style.display = 'block';
    }
}

// Hiển thị dữ liệu lên bảng
function displayData(data) {
    const tableBody = document.getElementById('dataTable');
    const noDataDiv = document.getElementById('noData');
    
    if (data.length === 0) {
        tableBody.innerHTML = '';
        noDataDiv.style.display = 'block';
        return;
    }
    
    noDataDiv.style.display = 'none';
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td><span class="badge-id">${item.id}</span></td>
            <td><strong>${item.title}</strong></td>
            <td><span class="text-success fw-bold">${parseInt(item.views).toLocaleString()} VNĐ</span></td>
        </tr>
    `).join('');
}

// Tìm kiếm theo tên (sử dụng onchange)
function searchByName() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    
    filteredData = allData.filter(item => 
        item.title.toLowerCase().includes(searchValue)
    );
    
    displayData(filteredData);
}

// Sắp xếp theo tên tăng dần
function sortByNameAsc() {
    filteredData.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    displayData(filteredData);
}

// Sắp xếp theo tên giảm dần
function sortByNameDesc() {
    filteredData.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
    displayData(filteredData);
}

// Sắp xếp theo giá tăng dần
function sortByPriceAsc() {
    filteredData.sort((a, b) => parseInt(a.views) - parseInt(b.views));
    displayData(filteredData);
}

// Sắp xếp theo giá giảm dần
function sortByPriceDesc() {
    filteredData.sort((a, b) => parseInt(b.views) - parseInt(a.views));
    displayData(filteredData);
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Load dữ liệu ban đầu
    loadData();
    
    // Gắn sự kiện tìm kiếm với onchange
    document.getElementById('searchInput').addEventListener('input', searchByName);
    
    // Gắn sự kiện cho các nút sắp xếp
    document.getElementById('sortNameAsc').addEventListener('click', sortByNameAsc);
    document.getElementById('sortNameDesc').addEventListener('click', sortByNameDesc);
    document.getElementById('sortPriceAsc').addEventListener('click', sortByPriceAsc);
    document.getElementById('sortPriceDesc').addEventListener('click', sortByPriceDesc);
});
