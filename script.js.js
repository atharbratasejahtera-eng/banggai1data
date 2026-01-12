// Daftar kecamatan
let kecamatanList = [
    "BALANTAK", "BALANTAK SELATAN", "BALANTAK UTARA", "BATUI", "BATUI SELATAN",
    "BUALEMO", "BUNTA", "KINTOM", "LAMALA", "LOBU", "LUWUK", "LUWUK SELATAN",
    "LUWUK TIMUR", "LUWUK UTARA", "MANTOH", "MASAMA", "MOILONG", "NAMBO",
    "NUHON", "PAGIMANA", "SIMPANG RAYA", "TOILI", "TOILI BARAT", "TOILI JAYA"
];

// Data kosong - akan diisi melalui pendaftaran
let websiteData = [];

// Status login admin
let isAdminLoggedIn = false;

// Informasi login admin
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "banggai123"
};

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', function() {
    // Cek jika admin sudah login sebelumnya
    checkAdminLoginStatus();
    
    // Setup menu buttons
    setupMenuButtons();
    
    // Setup navigation buttons
    setupNavButtons();
    
    // Populate kecamatan dropdowns
    populateKecamatanDropdowns();
    
    // Populate kecamatan list
    renderKecamatanList();
    
    // Update statistik awal
    updateStats();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup monitoring filters
    setupMonitoringFilters();
    
    // Setup login system untuk admin
    setupLoginSystemAdmin();
    
    // Setup logout button
    setupLogoutButton();
    
    // Setup export buttons
    setupExportButtons();
    
    // Setup admin tools
    setupAdminTools();
    
    // Setup edit modal
    setupEditModal();
    
    // Load data from localStorage
    loadDataFromLocalStorage();
});

// Cek status login admin
function checkAdminLoginStatus() {
    const savedLogin = localStorage.getItem('banggaiAdminLoggedIn');
    
    if (savedLogin === 'true') {
        isAdminLoggedIn = true;
        document.getElementById('adminInfo').style.display = 'flex';
        document.getElementById('navLogin').style.display = 'none';
        document.getElementById('navAdminTools').style.display = 'flex';
        document.getElementById('userMenuSidebar').style.display = 'none';
        document.getElementById('adminMenuSidebar').style.display = 'block';
        showAdminToolsContent();
    }
}

// Load data from localStorage
function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('banggaiWebsiteData');
    const savedKecamatan = localStorage.getItem('banggaiKecamatanList');
    
    if (savedData) {
        websiteData = JSON.parse(savedData);
    }
    
    if (savedKecamatan) {
        kecamatanList = JSON.parse(savedKecamatan);
        populateKecamatanDropdowns();
        renderKecamatanList();
    }
    
    updateAllDisplays();
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('banggaiWebsiteData', JSON.stringify(websiteData));
    localStorage.setItem('banggaiKecamatanList', JSON.stringify(kecamatanList));
}

// Setup login system untuk admin
function setupLoginSystemAdmin() {
    const loginModal = document.getElementById('loginModalAdmin');
    const loginButton = document.getElementById('loginButtonAdmin');
    const navLoginButton = document.getElementById('navLogin');
    const usernameInput = document.getElementById('usernameAdmin');
    const passwordInput = document.getElementById('passwordAdmin');
    const loginError = document.getElementById('loginErrorAdmin');
    
    // Show login modal from nav button
    navLoginButton.addEventListener('click', function() {
        showLoginModalAdmin();
    });
    
    // Login button click
    loginButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        if (username === ADMIN_CREDENTIALS.username && 
            password === ADMIN_CREDENTIALS.password) {
            // Login berhasil
            isAdminLoggedIn = true;
            localStorage.setItem('banggaiAdminLoggedIn', 'true');
            
            // Hide login modal
            loginModal.classList.remove('active');
            
            // Show admin info in header
            document.getElementById('adminInfo').style.display = 'flex';
            document.getElementById('navLogin').style.display = 'none';
            document.getElementById('navAdminTools').style.display = 'flex';
            
            // Switch to admin menu sidebar
            document.getElementById('userMenuSidebar').style.display = 'none';
            document.getElementById('adminMenuSidebar').style.display = 'block';
            
            // Show admin tools content
            showAdminToolsContent();
            
            // Clear error
            loginError.classList.remove('active');
            
            // Clear input fields
            usernameInput.value = '';
            passwordInput.value = '';
            
            // Show success message
            alert('Login berhasil! Selamat datang, Admin.');
        } else {
            // Login gagal
            loginError.classList.add('active');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Enter key untuk login
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
    
    // Close modal ketika klik di luar
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            loginError.classList.remove('active');
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });
}

// Show login modal admin
function showLoginModalAdmin() {
    const loginModal = document.getElementById('loginModalAdmin');
    const loginError = document.getElementById('loginErrorAdmin');
    
    loginModal.classList.add('active');
    loginError.classList.remove('active');
    
    // Focus ke username field
    setTimeout(() => {
        document.getElementById('usernameAdmin').focus();
    }, 300);
}

// Setup logout button
function setupLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
    
    logoutButton.addEventListener('click', function() {
        // Logout admin
        isAdminLoggedIn = false;
        localStorage.removeItem('banggaiAdminLoggedIn');
        
        // Hide admin info
        document.getElementById('adminInfo').style.display = 'none';
        document.getElementById('navLogin').style.display = 'flex';
        document.getElementById('navAdminTools').style.display = 'none';
        
        // Switch to user menu sidebar
        document.getElementById('adminMenuSidebar').style.display = 'none';
        document.getElementById('userMenuSidebar').style.display = 'block';
        
        // Show pendaftaran content
        showPendaftaranContent();
        
        // Update nav button
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('navDashboard').classList.add('active');
        
        // Show logout message
        alert('Anda telah logout dari akun admin.');
    });
}

// Setup menu buttons
function setupMenuButtons() {
    // User menu buttons
    const userMenuButtons = document.querySelectorAll('#userMenuSidebar .menu-btn');
    userMenuButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Untuk user umum, hanya ada menu pendaftaran
            showPendaftaranContent();
            
            // Update active button
            userMenuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Admin menu buttons
    const adminMenuButtons = document.querySelectorAll('#adminMenuSidebar .menu-btn');
    adminMenuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuId = this.id;
            
            // Remove active class from all buttons
            adminMenuButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all menu sections
            document.querySelectorAll('.menu-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show corresponding menu section
            if (menuId === 'menuPendaftaranAdmin') {
                showPendaftaranContent();
                document.getElementById('pageTitle').textContent = 'DASHBOARD UTAMA - PENDAFTARAN';
            } else if (menuId === 'menuMonitoring') {
                showMonitoringContent();
                document.getElementById('pageTitle').textContent = 'DASHBOARD UTAMA - MONITORING DATA';
            } else if (menuId === 'menuExport') {
                showExportContent();
                document.getElementById('pageTitle').textContent = 'DASHBOARD UTAMA - EKSPORT DATA';
            } else if (menuId === 'menuKecamatan') {
                showKecamatanContent();
                document.getElementById('pageTitle').textContent = 'DASHBOARD UTAMA - DAFTAR KECAMATAN';
            } else if (menuId === 'menuStatistik') {
                showStatistikContent();
                document.getElementById('pageTitle').textContent = 'DASHBOARD UTAMA - STATISTIK';
            }
        });
    });
}

// Setup navigation buttons
function setupNavButtons() {
    document.getElementById('navDashboard').addEventListener('click', function() {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Tampilkan konten berdasarkan role
        if (isAdminLoggedIn) {
            // Admin melihat admin tools
            showAdminToolsContent();
            
            // Update menu button
            document.querySelectorAll('#adminMenuSidebar .menu-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('menuPendaftaranAdmin').classList.add('active');
        } else {
            // User umum melihat pendaftaran
            showPendaftaranContent();
            
            // Update menu button
            document.querySelectorAll('#userMenuSidebar .menu-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('menuPendaftaran').classList.add('active');
        }
        
        document.getElementById('pageTitle').textContent = 'DASHBOARD UTAMA';
    });
    
    document.getElementById('navAdminTools').addEventListener('click', function() {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Tampilkan admin tools
        showAdminToolsContent();
        document.getElementById('pageTitle').textContent = 'ADMIN TOOLS';
    });
}

// Show pendaftaran content
function showPendaftaranContent() {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('pendaftaranContent').style.display = 'block';
}

// Show admin tools content
function showAdminToolsContent() {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('adminToolsContent').style.display = 'block';
    renderAdminTable();
}

// Show monitoring content
function showMonitoringContent() {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('monitoringContent').style.display = 'block';
    renderMonitoringTable();
    updateMonitoringStats();
}

// Show export content
function showExportContent() {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('exportContent').style.display = 'block';
    updateExportPreview();
}

// Show kecamatan content
function showKecamatanContent() {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('kecamatanContent').style.display = 'block';
    renderKecamatanStatusList();
}

// Show statistik content
function showStatistikContent() {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('statistikContent').style.display = 'block';
    renderStatistik();
}

// Setup admin tools
function setupAdminTools() {
    // Open admin tools modal
    document.getElementById('openAdminToolsModal').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.add('active');
    });
    
    // Close admin tools modal
    document.getElementById('closeAdminToolsModal').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
    });
    
    // Tool: Edit All Data
    document.getElementById('toolEditAllData').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
        renderAdminTable();
    });
    
    // Tool: Manage Kecamatan
    document.getElementById('toolManageKecamatan').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
        showManageKecamatanModal();
    });
    
    // Tool: Edit Menu
    document.getElementById('toolEditMenu').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
        showEditMenuModal();
    });
    
    // Tool: Backup Data
    document.getElementById('toolBackupData').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
        showBackupDataModal();
    });
    
    // Tool: Edit Content
    document.getElementById('toolEditContent').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
        showEditContentModal();
    });
    
    // Tool: System Settings
    document.getElementById('toolSystemSettings').addEventListener('click', function() {
        document.getElementById('adminToolsModal').classList.remove('active');
        showSystemSettingsModal();
    });
    
    // Close modal when clicking outside
    document.getElementById('adminToolsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

// Setup edit modal
function setupEditModal() {
    // Close edit modal
    document.getElementById('closeEditModal').addEventListener('click', function() {
        document.getElementById('editModal').classList.remove('active');
    });
    
    // Close modal when clicking outside
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

// Show manage kecamatan modal
function showManageKecamatanModal() {
    let modalContent = `
        <h4 style="margin-bottom: 20px;">Kelola Daftar Kecamatan</h4>
        <div style="margin-bottom: 20px;">
            <button class="submit-btn hijau" id="addKecamatanBtn" style="margin-bottom: 15px;">
                <i class="fas fa-plus"></i> Tambah Kecamatan Baru
            </button>
            <div id="kecamatanListContainer" style="max-height: 300px; overflow-y: auto;">
    `;
    
    kecamatanList.forEach((kecamatan, index) => {
        modalContent += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: ${index % 2 === 0 ? '#f8f9fa' : 'white'}; border-radius: 5px; margin-bottom: 5px;">
                <span>${kecamatan}</span>
                <div>
                    <button class="action-btn edit-btn" data-index="${index}" onclick="editKecamatan(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}" onclick="deleteKecamatan(${index})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    });
    
    modalContent += `
            </div>
        </div>
        <div id="addKecamatanForm" style="display: none; margin-top: 20px;">
            <div class="form-group">
                <label for="newKecamatanName">Nama Kecamatan</label>
                <input type="text" id="newKecamatanName" placeholder="Masukkan nama kecamatan" style="width: 100%;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="submit-btn hijau" id="saveKecamatanBtn">
                    <i class="fas fa-save"></i> Simpan
                </button>
                <button class="submit-btn cancel-btn" id="cancelAddKecamatanBtn">
                    <i class="fas fa-times"></i> Batal
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('editModalContent').innerHTML = modalContent;
    document.getElementById('editModal').classList.add('active');
    
    // Setup event listeners for kecamatan modal
    document.getElementById('addKecamatanBtn').addEventListener('click', function() {
        document.getElementById('addKecamatanForm').style.display = 'block';
        document.getElementById('newKecamatanName').focus();
    });
    
    document.getElementById('saveKecamatanBtn').addEventListener('click', function() {
        const newKecamatan = document.getElementById('newKecamatanName').value.trim();
        
        if (newKecamatan) {
            kecamatanList.push(newKecamatan.toUpperCase());
            saveDataToLocalStorage();
            populateKecamatanDropdowns();
            renderKecamatanList();
            renderKecamatanStatusList();
            showManageKecamatanModal(); // Refresh modal
            alert('Kecamatan berhasil ditambahkan!');
        }
    });
    
    document.getElementById('cancelAddKecamatanBtn').addEventListener('click', function() {
        document.getElementById('addKecamatanForm').style.display = 'none';
        document.getElementById('newKecamatanName').value = '';
    });
}

// Edit kecamatan
function editKecamatan(index) {
    const oldName = kecamatanList[index];
    const newName = prompt('Edit nama kecamatan:', oldName);
    
    if (newName && newName.trim() !== '' && newName !== oldName) {
        kecamatanList[index] = newName.toUpperCase();
        
        // Update data yang terkait
        websiteData.forEach(item => {
            if (item.kecamatan === oldName) {
                item.kecamatan = newName.toUpperCase();
            }
        });
        
        saveDataToLocalStorage();
        populateKecamatanDropdowns();
        renderKecamatanList();
        renderKecamatanStatusList();
        showManageKecamatanModal(); // Refresh modal
        alert('Kecamatan berhasil diubah!');
    }
}

// Delete kecamatan
function deleteKecamatan(index) {
    const kecamatanName = kecamatanList[index];
    
    // Cek apakah ada data yang menggunakan kecamatan ini
    const hasData = websiteData.some(item => item.kecamatan === kecamatanName);
    
    if (hasData) {
        alert(`Tidak dapat menghapus kecamatan ${kecamatanName} karena masih ada data desa yang menggunakan kecamatan ini.`);
        return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menghapus kecamatan ${kecamatanName}?`)) {
        kecamatanList.splice(index, 1);
        saveDataToLocalStorage();
        populateKecamatanDropdowns();
        renderKecamatanList();
        renderKecamatanStatusList();
        showManageKecamatanModal(); // Refresh modal
        alert('Kecamatan berhasil dihapus!');
    }
}

// Show edit menu modal
function showEditMenuModal() {
    const modalContent = `
        <h4 style="margin-bottom: 20px;">Kelola Menu Admin</h4>
        <p style="margin-bottom: 20px;">Aktifkan atau nonaktifkan menu yang tersedia untuk admin:</p>
        
        <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="menuMonitoringCheckbox" checked style="margin-right: 10px;">
                <span>Menu Monitoring Data</span>
            </label>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="menuExportCheckbox" checked style="margin-right: 10px;">
                <span>Menu Eksport Data</span>
            </label>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="menuKecamatanCheckbox" checked style="margin-right: 10px;">
                <span>Menu Daftar Kecamatan</span>
            </label>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="menuStatistikCheckbox" checked style="margin-right: 10px;">
                <span>Menu Statistik</span>
            </label>
        </div>
        
        <button class="submit-btn hijau" id="saveMenuSettingsBtn">
            <i class="fas fa-save"></i> Simpan Pengaturan Menu
        </button>
    `;
    
    document.getElementById('editModalContent').innerHTML = modalContent;
    document.getElementById('editModal').classList.add('active');
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('banggaiMenuSettings') || '{"monitoring": true, "export": true, "kecamatan": true, "statistik": true}');
    
    document.getElementById('menuMonitoringCheckbox').checked = savedSettings.monitoring;
    document.getElementById('menuExportCheckbox').checked = savedSettings.export;
    document.getElementById('menuKecamatanCheckbox').checked = savedSettings.kecamatan;
    document.getElementById('menuStatistikCheckbox').checked = savedSettings.statistik;
    
    // Save settings
    document.getElementById('saveMenuSettingsBtn').addEventListener('click', function() {
        const settings = {
            monitoring: document.getElementById('menuMonitoringCheckbox').checked,
            export: document.getElementById('menuExportCheckbox').checked,
            kecamatan: document.getElementById('menuKecamatanCheckbox').checked,
            statistik: document.getElementById('menuStatistikCheckbox').checked
        };
        
        localStorage.setItem('banggaiMenuSettings', JSON.stringify(settings));
        alert('Pengaturan menu berhasil disimpan!');
        document.getElementById('editModal').classList.remove('active');
    });
}

// Show backup data modal
function showBackupDataModal() {
    const modalContent = `
        <h4 style="margin-bottom: 20px;">Backup dan Restore Data</h4>
        
        <div style="background-color: #e8f4fc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h5><i class="fas fa-download"></i> Backup Data</h5>
            <p style="margin-bottom: 15px;">Unduh salinan semua data website desa dalam format JSON.</p>
            <button class="submit-btn hijau" id="backupDataBtn">
                <i class="fas fa-file-download"></i> Backup Data ke JSON
            </button>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h5><i class="fas fa-upload"></i> Restore Data</h5>
            <p style="margin-bottom: 10px;">Upload file JSON untuk mengembalikan data.</p>
            <div class="form-group">
                <label for="restoreFile">Pilih File JSON</label>
                <input type="file" id="restoreFile" accept=".json" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <button class="submit-btn" id="restoreDataBtn" style="margin-top: 10px;">
                <i class="fas fa-file-upload"></i> Restore Data
            </button>
        </div>
        
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px;">
            <h5><i class="fas fa-exclamation-triangle"></i> Hapus Semua Data</h5>
            <p style="margin-bottom: 15px;">Peringatan: Tindakan ini akan menghapus semua data dan tidak dapat dibatalkan.</p>
            <button class="submit-btn merah" id="deleteAllDataBtn">
                <i class="fas fa-trash"></i> Hapus Semua Data
            </button>
        </div>
    `;
    
    document.getElementById('editModalContent').innerHTML = modalContent;
    document.getElementById('editModal').classList.add('active');
    
    // Backup data
    document.getElementById('backupDataBtn').addEventListener('click', function() {
        const dataToBackup = {
            websiteData: websiteData,
            kecamatanList: kecamatanList,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(dataToBackup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `backup-banggai-satu-data-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Data berhasil di-backup!');
    });
    
    // Restore data
    document.getElementById('restoreDataBtn').addEventListener('click', function() {
        const fileInput = document.getElementById('restoreFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Pilih file JSON terlebih dahulu!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const restoredData = JSON.parse(e.target.result);
                
                if (confirm('Restore data akan menggantikan semua data yang ada. Lanjutkan?')) {
                    if (restoredData.websiteData) websiteData = restoredData.websiteData;
                    if (restoredData.kecamatanList) kecamatanList = restoredData.kecamatanList;
                    
                    saveDataToLocalStorage();
                    populateKecamatanDropdowns();
                    renderKecamatanList();
                    updateAllDisplays();
                    
                    alert('Data berhasil direstore!');
                    document.getElementById('editModal').classList.remove('active');
                }
            } catch (error) {
                alert('File tidak valid! Pastikan file yang diupload adalah backup data yang benar.');
            }
        };
        reader.readAsText(file);
    });
    
    // Delete all data
    document.getElementById('deleteAllDataBtn').addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!')) {
            websiteData = [];
            saveDataToLocalStorage();
            updateAllDisplays();
            alert('Semua data berhasil dihapus!');
            document.getElementById('editModal').classList.remove('active');
        }
    });
}

// Show edit content modal
function showEditContentModal() {
    const modalContent = `
        <h4 style="margin-bottom: 20px;">Edit Konten Halaman</h4>
        
        <div class="form-group">
            <label for="editPageTitle">Judul Halaman Utama</label>
            <input type="text" id="editPageTitle" value="BANGGAI SATU DATA" style="width: 100%;">
        </div>
        
        <div class="form-group">
            <label for="editPageSubtitle">Subjudul Halaman Utama</label>
            <input type="text" id="editPageSubtitle" value="Modern - Terintegrasi - Akuntabel" style="width: 100%;">
        </div>
        
        <div class="form-group">
            <label for="editRunningText">Teks Running Text</label>
            <textarea id="editRunningText" rows="3" style="width: 100%;">BANGGAI SATU DATA BANGGAI MODERN - Sistem Pendataan dan Monitoring Website Desa Kabupaten Banggai - Terintegrasi dengan 24 Kecamatan - Data Terkini dan Akurat - Dikelola oleh Diskominfo Kabupaten Banggai -</textarea>
        </div>
        
        <div class="form-group">
            <label for="editFooterText">Teks Footer</label>
            <textarea id="editFooterText" rows="3" style="width: 100%;">Sistem terintegrasi untuk pendataan, pendaftaran, monitoring, dan eksport data website desa di Kabupaten Banggai.</textarea>
        </div>
        
        <button class="submit-btn hijau" id="saveContentBtn">
            <i class="fas fa-save"></i> Simpan Perubahan Konten
        </button>
    `;
    
    document.getElementById('editModalContent').innerHTML = modalContent;
    document.getElementById('editModal').classList.add('active');
    
    // Load saved content
    const savedContent = JSON.parse(localStorage.getItem('banggaiPageContent') || '{}');
    
    document.getElementById('editPageTitle').value = savedContent.title || "BANGGAI SATU DATA";
    document.getElementById('editPageSubtitle').value = savedContent.subtitle || "Modern - Terintegrasi - Akuntabel";
    document.getElementById('editRunningText').value = savedContent.runningText || "BANGGAI SATU DATA BANGGAI MODERN - Sistem Pendataan dan Monitoring Website Desa Kabupaten Banggai - Terintegrasi dengan 24 Kecamatan - Data Terkini dan Akurat - Dikelola oleh Diskominfo Kabupaten Banggai -";
    document.getElementById('editFooterText').value = savedContent.footerText || "Sistem terintegrasi untuk pendataan, pendaftaran, monitoring, dan eksport data website desa di Kabupaten Banggai.";
    
    // Save content
    document.getElementById('saveContentBtn').addEventListener('click', function() {
        const content = {
            title: document.getElementById('editPageTitle').value,
            subtitle: document.getElementById('editPageSubtitle').value,
            runningText: document.getElementById('editRunningText').value,
            footerText: document.getElementById('editFooterText').value
        };
        
        localStorage.setItem('banggaiPageContent', JSON.stringify(content));
        
        // Apply changes
        document.querySelector('.logo-text h1').textContent = content.title;
        document.querySelector('.logo-text p').textContent = content.subtitle;
        document.querySelector('.running-text').innerHTML = `<i class="fas fa-bullhorn"></i> ${content.runningText}`;
        document.querySelector('.footer-text p').textContent = content.footerText;
        
        alert('Konten berhasil diperbarui!');
        document.getElementById('editModal').classList.remove('active');
    });
}

// Show system settings modal
function showSystemSettingsModal() {
    const modalContent = `
        <h4 style="margin-bottom: 20px;">Pengaturan Sistem</h4>
        
        <div class="form-group">
            <label for="systemName">Nama Sistem</label>
            <input type="text" id="systemName" value="BANGGAI SATU DATA" style="width: 100%;">
        </div>
        
        <div class="form-group">
            <label for="adminUsername">Username Admin</label>
            <input type="text" id="adminUsername" value="admin" style="width: 100%;">
        </div>
        
        <div class="form-group">
            <label for="adminPassword">Password Admin (kosongkan jika tidak ingin mengubah)</label>
            <input type="password" id="adminPassword" placeholder="Password baru" style="width: 100%;">
        </div>
        
        <div class="form-group">
            <label for="defaultKecamatan">Kecamatan Default di Form</label>
            <select id="defaultKecamatan" style="width: 100%; padding: 10px;">
                <option value="">Tidak ada default</option>
                ${kecamatanList.map(k => `<option value="${k}">${k}</option>`).join('')}
            </select>
        </div>
        
        <button class="submit-btn hijau" id="saveSystemSettingsBtn">
            <i class="fas fa-save"></i> Simpan Pengaturan Sistem
        </button>
    `;
    
    document.getElementById('editModalContent').innerHTML = modalContent;
    document.getElementById('editModal').classList.add('active');
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('banggaiSystemSettings') || '{}');
    
    document.getElementById('systemName').value = savedSettings.systemName || "BANGGAI SATU DATA";
    document.getElementById('adminUsername').value = savedSettings.adminUsername || "admin";
    document.getElementById('defaultKecamatan').value = savedSettings.defaultKecamatan || "";
    
    // Save settings
    document.getElementById('saveSystemSettingsBtn').addEventListener('click', function() {
        const settings = {
            systemName: document.getElementById('systemName').value,
            adminUsername: document.getElementById('adminUsername').value,
            defaultKecamatan: document.getElementById('defaultKecamatan').value
        };
        
        const newPassword = document.getElementById('adminPassword').value;
        if (newPassword) {
            ADMIN_CREDENTIALS.password = newPassword;
            alert('Password admin telah diubah!');
        }
        
        localStorage.setItem('banggaiSystemSettings', JSON.stringify(settings));
        
        // Update admin credentials
        ADMIN_CREDENTIALS.username = settings.adminUsername;
        
        alert('Pengaturan sistem berhasil disimpan!');
        document.getElementById('editModal').classList.remove('active');
    });
}

// Setup export buttons
function setupExportButtons() {
    const exportExcelBtn = document.getElementById('exportExcel');
    const exportPDFBtn = document.getElementById('exportPDF');
    const exportPrintBtn = document.getElementById('exportPrint');
    const exportStatus = document.getElementById('exportStatus');
    
    // Export to Excel
    exportExcelBtn.addEventListener('click', function() {
        if (websiteData.length === 0) {
            exportStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Tidak ada data untuk dieksport!';
            exportStatus.className = 'export-status error';
            return;
        }
        
        exportStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyiapkan file Excel...';
        exportStatus.className = 'export-status';
        exportStatus.style.display = 'block';
        
        // Simulasi proses export
        setTimeout(() => {
            const csvContent = convertToCSV(websiteData);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `data-website-desa-banggai-${new Date().toISOString().slice(0,10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            exportStatus.innerHTML = '<i class="fas fa-check-circle"></i> Data berhasil dieksport ke Excel!';
            exportStatus.className = 'export-status success';
        }, 1500);
    });
    
    // Export to PDF
    exportPDFBtn.addEventListener('click', function() {
        if (websiteData.length === 0) {
            exportStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Tidak ada data untuk dieksport!';
            exportStatus.className = 'export-status error';
            return;
        }
        
        exportStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyiapkan file PDF...';
        exportStatus.className = 'export-status';
        exportStatus.style.display = 'block';
        
        // Simulasi proses export PDF
        setTimeout(() => {
            exportStatus.innerHTML = '<i class="fas fa-check-circle"></i> Fitur export PDF akan segera tersedia!';
            exportStatus.className = 'export-status success';
            alert('Fitur export PDF dalam pengembangan. Untuk saat ini gunakan export Excel.');
        }, 1500);
    });
    
    // Print Report
    exportPrintBtn.addEventListener('click', function() {
        if (websiteData.length === 0) {
            exportStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Tidak ada data untuk dicetak!';
            exportStatus.className = 'export-status error';
            return;
        }
        
        exportStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyiapkan laporan untuk dicetak...';
        exportStatus.className = 'export-status';
        exportStatus.style.display = 'block';
        
        // Simulasi proses print
        setTimeout(() => {
            const printContent = generatePrintContent();
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
            
            exportStatus.innerHTML = '<i class="fas fa-check-circle"></i> Laporan siap dicetak!';
            exportStatus.className = 'export-status success';
        }, 1000);
    });
}

// Convert data to CSV
function convertToCSV(data) {
    const headers = ['No', 'Desa', 'Kecamatan', 'URL Website', 'Jenis Pendaftaran', 'Penanggung Jawab', 'Telepon', 'Email', 'Tanggal Daftar'];
    const rows = data.map((item, index) => [
        index + 1,
        `"${item.desa}"`,
        `"${item.kecamatan}"`,
        `"${item.url || '-'}"`,
        `"${getJenisText(item.jenis)}"`,
        `"${item.contactPerson}"`,
        `"${item.contactPhone}"`,
        `"${item.email || '-'}"`,
        `"${item.tanggal}"`
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
}

// Get jenis text
function getJenisText(jenis) {
    switch(jenis) {
        case 'baru': return 'Website Baru';
        case 'pengembangan': return 'Pengembangan Website';
        default: return '-';
    }
}

// Generate print content
function generatePrintContent() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let tableRows = '';
    websiteData.forEach((item, index) => {
        tableRows += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.desa}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.kecamatan}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.url || '-'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${getJenisText(item.jenis)}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.contactPerson}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.tanggal}</td>
            </tr>
        `;
    });
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laporan Website Desa Kabupaten Banggai</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2C3E50; text-align: center; }
                .header { text-align: center; margin-bottom: 30px; }
                .subtitle { color: #7F8C8D; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #4A90E2; color: white; padding: 10px; text-align: left; }
                .summary { margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
                .footer { margin-top: 40px; text-align: center; color: #7F8C8D; font-size: 0.9em; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LAPORAN DATA WEBSITE DESA</h1>
                <h2>KABUPATEN BANGGAI</h2>
                <p class="subtitle">Tanggal Cetak: ${formattedDate}</p>
            </div>
            
            <div class="summary">
                <h3>Ringkasan Data:</h3>
                <p>Total Desa Terdaftar: ${websiteData.length}</p>
                <p>Website Baru: ${websiteData.filter(item => item.jenis === 'baru').length}</p>
                <p>Pengembangan Website: ${websiteData.filter(item => item.jenis === 'pengembangan').length}</p>
                <p>Kecamatan Terdaftar: ${new Set(websiteData.map(item => item.kecamatan)).size}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Desa</th>
                        <th>Kecamatan</th>
                        <th>URL Website</th>
                        <th>Jenis Pendaftaran</th>
                        <th>Penanggung Jawab</th>
                        <th>Tanggal Daftar</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Dicetak dari Sistem Banggai Satu Data Modern</p>
                <p>Dinas Komunikasi dan Informatika Kabupaten Banggai</p>
                <p>© ${date.getFullYear()} - Hak Cipta Dilindungi Undang-Undang</p>
            </div>
        </body>
        </html>
    `;
}

// Update export preview
function updateExportPreview() {
    const exportPreview = document.getElementById('exportPreview');
    
    if (websiteData.length === 0) {
        exportPreview.innerHTML = `
            <div class="no-data">
                <i class="fas fa-database"></i>
                <p>Tidak ada data untuk ditampilkan.</p>
                <p>Silakan daftarkan website desa melalui menu Pendaftaran.</p>
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Desa</th>
                    <th>Kecamatan</th>
                    <th>URL Website</th>
                    <th>Jenis Pendaftaran</th>
                    <th>Penanggung Jawab</th>
                    <th>Tanggal Daftar</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    websiteData.forEach((item, index) => {
        // Tentukan status badge
        let statusClass = '';
        let statusText = '';
        
        switch(item.jenis) {
            case 'baru':
                statusClass = 'status-baru';
                statusText = 'Baru';
                break;
            case 'pengembangan':
                statusClass = 'status-pengembangan';
                statusText = 'Pengembangan';
                break;
        }
        
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.desa}</td>
                <td>${item.kecamatan}</td>
                <td>${item.url ? `<a href="${item.url}" target="_blank">${item.url}</a>` : '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${item.contactPerson}<br><small>${item.contactPhone}</small></td>
                <td>${item.tanggal}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    exportPreview.innerHTML = tableHTML;
}

// Populate kecamatan dropdowns
function populateKecamatanDropdowns() {
    const kecamatanSelects = document.querySelectorAll('#kecamatan, #kecamatanFilter');
    
    kecamatanSelects.forEach(select => {
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add kecamatan options
        kecamatanList.forEach(kecamatan => {
            const option = document.createElement('option');
            option.value = kecamatan;
            option.textContent = kecamatan;
            select.appendChild(option);
        });
    });
    
    // Set default kecamatan if configured
    const settings = JSON.parse(localStorage.getItem('banggaiSystemSettings') || '{}');
    if (settings.defaultKecamatan) {
        document.getElementById('kecamatan').value = settings.defaultKecamatan;
    }
}

// Render kecamatan list
function renderKecamatanList() {
    const kecamatanListContainer = document.getElementById('kecamatanList');
    kecamatanListContainer.innerHTML = '';
    
    kecamatanList.forEach(kecamatan => {
        // Hitung jumlah desa terdaftar di kecamatan ini
        const desaCount = websiteData.filter(item => item.kecamatan === kecamatan).length;
        
        const item = document.createElement('div');
        item.className = 'kecamatan-item';
        item.innerHTML = `
            <div class="kecamatan-name">${kecamatan}</div>
            <div class="kecamatan-count">${desaCount} Desa Terdaftar</div>
        `;
        kecamatanListContainer.appendChild(item);
    });
}

// Setup form submission
function setupFormSubmission() {
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const desaName = document.getElementById('desaName').value;
        const kecamatan = document.getElementById('kecamatan').value;
        const websiteUrl = document.getElementById('websiteUrl').value;
        const jenisPendaftaran = document.getElementById('jenisPendaftaran').value;
        const contactPerson = document.getElementById('contactPerson').value;
        const contactPhone = document.getElementById('contactPhone').value;
        const email = document.getElementById('email').value;
        
        // Validate form
        if (!desaName || !kecamatan || !jenisPendaftaran || !contactPerson || !contactPhone) {
            alert('Harap isi semua field yang wajib diisi (ditandai dengan *)');
            return;
        }
        
        // Generate ID baru
        const newId = websiteData.length > 0 ? Math.max(...websiteData.map(item => item.id)) + 1 : 1;
        
        // Generate tanggal pendaftaran
        const today = new Date();
        const tanggal = today.toISOString().split('T')[0];
        
        // Tambah data baru
        const newData = {
            id: newId,
            desa: desaName,
            kecamatan: kecamatan,
            url: websiteUrl,
            jenis: jenisPendaftaran,
            contactPerson: contactPerson,
            contactPhone: contactPhone,
            email: email,
            tanggal: tanggal
        };
        
        websiteData.push(newData);
        
        // Save to localStorage
        saveDataToLocalStorage();
        
        // Reset form
        this.reset();
        
        // Set default kecamatan if configured
        const settings = JSON.parse(localStorage.getItem('banggaiSystemSettings') || '{}');
        if (settings.defaultKecamatan) {
            document.getElementById('kecamatan').value = settings.defaultKecamatan;
        }
        
        // Update UI
        updateAllDisplays();
        
        // Tampilkan pesan sukses
        alert(`Data website desa ${desaName} (${kecamatan}) berhasil didaftarkan!`);
    });
}

// Setup monitoring filters
function setupMonitoringFilters() {
    document.getElementById('searchInput').addEventListener('input', renderMonitoringTable);
    document.getElementById('kecamatanFilter').addEventListener('change', renderMonitoringTable);
    document.getElementById('jenisFilter').addEventListener('change', renderMonitoringTable);
    document.getElementById('resetFilter').addEventListener('click', function() {
        document.getElementById('searchInput').value = '';
        document.getElementById('kecamatanFilter').value = '';
        document.getElementById('jenisFilter').value = '';
        renderMonitoringTable();
    });
}

// Render monitoring table
function renderMonitoringTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const kecamatanFilter = document.getElementById('kecamatanFilter').value;
    const jenisFilter = document.getElementById('jenisFilter').value;
    
    // Filter data
    let filteredData = websiteData;
    
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.desa.toLowerCase().includes(searchTerm) || 
            item.kecamatan.toLowerCase().includes(searchTerm)
        );
    }
    
    if (kecamatanFilter) {
        filteredData = filteredData.filter(item => 
            item.kecamatan === kecamatanFilter
        );
    }
    
    if (jenisFilter) {
        filteredData = filteredData.filter(item => 
            item.jenis === jenisFilter
        );
    }
    
    // Render table
    const tableContainer = document.getElementById('tableContainer');
    
    if (filteredData.length === 0) {
        tableContainer.innerHTML = `
            <div class="no-data">
                <i class="fas fa-database"></i>
                <p>Tidak ada data website desa yang ditemukan.</p>
                <p>Silakan daftarkan website desa melalui menu Pendaftaran.</p>
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Desa</th>
                    <th>Kecamatan</th>
                    <th>URL Website</th>
                    <th>Jenis Pendaftaran</th>
                    <th>Penanggung Jawab</th>
                    <th>Tanggal Daftar</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    filteredData.forEach((item, index) => {
        // Tentukan status badge
        let statusClass = '';
        let statusText = '';
        
        switch(item.jenis) {
            case 'baru':
                statusClass = 'status-baru';
                statusText = 'Website Baru';
                break;
            case 'pengembangan':
                statusClass = 'status-pengembangan';
                statusText = 'Pengembangan';
                break;
        }
        
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.desa}</td>
                <td>${item.kecamatan}</td>
                <td>${item.url ? `<a href="${item.url}" target="_blank">${item.url}</a>` : '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${item.contactPerson}<br><small>${item.contactPhone}</small></td>
                <td>${item.tanggal}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

// Render admin table with edit/delete buttons
function renderAdminTable() {
    const searchTerm = document.getElementById('adminSearchInput') ? document.getElementById('adminSearchInput').value.toLowerCase() : '';
    
    // Filter data
    let filteredData = websiteData;
    
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.desa.toLowerCase().includes(searchTerm) || 
            item.kecamatan.toLowerCase().includes(searchTerm)
        );
    }
    
    // Render table
    const tableContainer = document.getElementById('adminTableContainer');
    
    if (filteredData.length === 0) {
        tableContainer.innerHTML = `
            <div class="no-data">
                <i class="fas fa-database"></i>
                <p>Tidak ada data website desa yang ditemukan.</p>
                <p>Silakan daftarkan website desa melalui menu Pendaftaran.</p>
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Desa</th>
                    <th>Kecamatan</th>
                    <th>URL Website</th>
                    <th>Jenis Pendaftaran</th>
                    <th>Penanggung Jawab</th>
                    <th>Tanggal Daftar</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    filteredData.forEach((item, index) => {
        // Tentukan status badge
        let statusClass = '';
        let statusText = '';
        
        switch(item.jenis) {
            case 'baru':
                statusClass = 'status-baru';
                statusText = 'Website Baru';
                break;
            case 'pengembangan':
                statusClass = 'status-pengembangan';
                statusText = 'Pengembangan';
                break;
        }
        
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.desa}</td>
                <td>${item.kecamatan}</td>
                <td>${item.url ? `<a href="${item.url}" target="_blank">${item.url}</a>` : '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${item.contactPerson}<br><small>${item.contactPhone}</small></td>
                <td>${item.tanggal}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit-btn" onclick="editData(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteData(${item.id})">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
    
    // Setup search for admin table
    if (document.getElementById('adminSearchInput')) {
        document.getElementById('adminSearchInput').addEventListener('input', renderAdminTable);
    }
}

// Edit data
function editData(id) {
    const data = websiteData.find(item => item.id === id);
    if (!data) return;
    
    const modalContent = `
        <h4 style="margin-bottom: 20px;">Edit Data Website Desa</h4>
        
        <div class="form-row">
            <div class="form-group">
                <label for="editDesaName">Nama Desa *</label>
                <input type="text" id="editDesaName" value="${data.desa}" required>
            </div>
            
            <div class="form-group">
                <label for="editKecamatan">Kecamatan *</label>
                <select id="editKecamatan" required>
                    <option value="">Pilih Kecamatan</option>
                    ${kecamatanList.map(k => `<option value="${k}" ${k === data.kecamatan ? 'selected' : ''}>${k}</option>`).join('')}
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="editWebsiteUrl">URL Website</label>
                <input type="url" id="editWebsiteUrl" value="${data.url || ''}" placeholder="https://contohdesa.banggai.go.id">
            </div>
            
            <div class="form-group">
                <label for="editJenisPendaftaran">Jenis Pendaftaran *</label>
                <select id="editJenisPendaftaran" required>
                    <option value="">Pilih Jenis Pendaftaran</option>
                    <option value="baru" ${data.jenis === 'baru' ? 'selected' : ''}>Buat Website Baru</option>
                    <option value="pengembangan" ${data.jenis === 'pengembangan' ? 'selected' : ''}>Pengembangan Website (Sudah Ada)</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="editContactPerson">Nama Penanggung Jawab *</label>
                <input type="text" id="editContactPerson" value="${data.contactPerson}" required>
            </div>
            
            <div class="form-group">
                <label for="editContactPhone">Nomor Telepon *</label>
                <input type="tel" id="editContactPhone" value="${data.contactPhone}" required>
            </div>
        </div>
        
        <div class="form-group">
            <label for="editEmail">Email</label>
            <input type="email" id="editEmail" value="${data.email || ''}" placeholder="email@desa.banggai.go.id">
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="submit-btn hijau" onclick="saveEditData(${id})">
                <i class="fas fa-save"></i> Simpan Perubahan
            </button>
            <button class="submit-btn cancel-btn" onclick="document.getElementById('editModal').classList.remove('active')">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
    
    document.getElementById('editModalContent').innerHTML = modalContent;
    document.getElementById('editModal').classList.add('active');
}

// Save edited data
function saveEditData(id) {
    const index = websiteData.findIndex(item => item.id === id);
    if (index === -1) return;
    
    // Get form values
    const desaName = document.getElementById('editDesaName').value;
    const kecamatan = document.getElementById('editKecamatan').value;
    const websiteUrl = document.getElementById('editWebsiteUrl').value;
    const jenisPendaftaran = document.getElementById('editJenisPendaftaran').value;
    const contactPerson = document.getElementById('editContactPerson').value;
    const contactPhone = document.getElementById('editContactPhone').value;
    const email = document.getElementById('editEmail').value;
    
    // Validate form
    if (!desaName || !kecamatan || !jenisPendaftaran || !contactPerson || !contactPhone) {
        alert('Harap isi semua field yang wajib diisi (ditandai dengan *)');
        return;
    }
    
    // Update data
    websiteData[index] = {
        ...websiteData[index],
        desa: desaName,
        kecamatan: kecamatan,
        url: websiteUrl,
        jenis: jenisPendaftaran,
        contactPerson: contactPerson,
        contactPhone: contactPhone,
        email: email
    };
    
    // Save to localStorage
    saveDataToLocalStorage();
    
    // Update UI
    updateAllDisplays();
    
    // Close modal
    document.getElementById('editModal').classList.remove('active');
    
    // Show success message
    alert('Data berhasil diperbarui!');
}

// Delete data
function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        const index = websiteData.findIndex(item => item.id === id);
        if (index === -1) return;
        
        websiteData.splice(index, 1);
        
        // Save to localStorage
        saveDataToLocalStorage();
        
        // Update UI
        updateAllDisplays();
        
        // Show success message
        alert('Data berhasil dihapus!');
    }
}

// Render kecamatan status list
function renderKecamatanStatusList() {
    const kecamatanStatusList = document.getElementById('kecamatanStatusList');
    kecamatanStatusList.innerHTML = '';
    
    kecamatanList.forEach(kecamatan => {
        // Ambil data desa untuk kecamatan ini
        const desaInKecamatan = websiteData.filter(item => item.kecamatan === kecamatan);
        const totalDesa = desaInKecamatan.length;
        
        // Tentukan warna border berdasarkan status
        let borderClass = '';
        const hasWebsite = desaInKecamatan.length > 0;
        if (hasWebsite) {
            borderClass = 'with-website';
        }
        
        const item = document.createElement('div');
        item.className = `kecamatan-item ${borderClass}`;
        item.innerHTML = `
            <div class="kecamatan-name">${kecamatan}</div>
            <div class="kecamatan-count">${totalDesa} Desa Terdaftar</div>
        `;
        kecamatanStatusList.appendChild(item);
    });
}

// Render statistik
function renderStatistik() {
    // Hitung statistik
    const totalDesa = websiteData.length;
    const websiteBaru = websiteData.filter(item => item.jenis === 'baru').length;
    const pengembanganWebsite = websiteData.filter(item => item.jenis === 'pengembangan').length;
    
    // Hitung kecamatan dengan website aktif
    const kecamatanTerdaftar = new Set();
    websiteData.forEach(item => {
        kecamatanTerdaftar.add(item.kecamatan);
    });
    
    const kecamatanAktif = kecamatanTerdaftar.size;
    const persentaseAktif = kecamatanList.length > 0 ? Math.round((kecamatanAktif / kecamatanList.length) * 100) : 0;
    
    // Update statistik cards
    document.getElementById('kecamatanAktif').textContent = kecamatanAktif;
    document.getElementById('persentaseAktif').textContent = `${persentaseAktif}%`;
    document.getElementById('tahunIni').textContent = new Date().getFullYear();
    
    // Render detail statistik per kecamatan
    const statistikDetail = document.getElementById('statistikDetail');
    let detailHTML = '<h4 style="margin-top: 30px; margin-bottom: 15px;">Statistik per Kecamatan</h4>';
    
    if (totalDesa === 0) {
        detailHTML += `
            <div class="no-data">
                <i class="fas fa-chart-bar"></i>
                <p>Belum ada data statistik.</p>
                <p>Silakan daftarkan website desa melalui menu Pendaftaran.</p>
            </div>
        `;
    } else {
        detailHTML += '<div style="overflow-x: auto;">';
        detailHTML += '<table>';
        detailHTML += `
            <thead>
                <tr>
                    <th>Kecamatan</th>
                    <th>Total Desa</th>
                    <th>Website Baru</th>
                    <th>Pengembangan</th>
                    <th>Persentase</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        kecamatanList.forEach(kecamatan => {
            const desaInKecamatan = websiteData.filter(item => item.kecamatan === kecamatan);
            const totalDesaKecamatan = desaInKecamatan.length;
            
            if (totalDesaKecamatan === 0) {
                return;
            }
            
            const websiteBaruKecamatan = desaInKecamatan.filter(item => item.jenis === 'baru').length;
            const pengembanganKecamatan = desaInKecamatan.filter(item => item.jenis === 'pengembangan').length;
            const persentaseKecamatan = Math.round((totalDesaKecamatan / websiteData.length) * 100);
            
            detailHTML += `
                <tr>
                    <td>${kecamatan}</td>
                    <td>${totalDesaKecamatan}</td>
                    <td>${websiteBaruKecamatan}</td>
                    <td>${pengembanganKecamatan}</td>
                    <td>${persentaseKecamatan}%</td>
                </tr>
            `;
        });
        
        detailHTML += '</tbody></table></div>';
    }
    
    statistikDetail.innerHTML = detailHTML;
}

// Update monitoring stats
function updateMonitoringStats() {
    const totalDesa = websiteData.length;
    const websiteBaru = websiteData.filter(item => item.jenis === 'baru').length;
    const pengembanganWebsite = websiteData.filter(item => item.jenis === 'pengembangan').length;
    const kecamatanTerdaftar = new Set(websiteData.map(item => item.kecamatan)).size;
    
    document.getElementById('totalDesa').textContent = totalDesa;
    document.getElementById('websiteBaru').textContent = websiteBaru;
    document.getElementById('pengembanganWebsite').textContent = pengembanganWebsite;
    document.getElementById('kecamatanTerdaftar').textContent = kecamatanTerdaftar;
}

// Update all displays
function updateAllDisplays() {
    renderKecamatanList();
    updateMonitoringStats();
    updateExportPreview();
    
    if (document.getElementById('monitoringContent').style.display === 'block') {
        renderMonitoringTable();
    }
    
    if (document.getElementById('exportContent').style.display === 'block') {
        updateExportPreview();
    }
    
    if (document.getElementById('kecamatanContent').style.display === 'block') {
        renderKecamatanStatusList();
    }
    
    if (document.getElementById('statistikContent').style.display === 'block') {
        renderStatistik();
    }
    
    if (document.getElementById('adminToolsContent').style.display === 'block') {
        renderAdminTable();
    }
}

// Fungsi global yang digunakan oleh HTML onclick
window.editKecamatan = editKecamatan;
window.deleteKecamatan = deleteKecamatan;
window.editData = editData;
window.saveEditData = saveEditData;
window.deleteData = deleteData;