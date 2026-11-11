/* =================================
   E3RAFNY - ADMIN SYSTEM
================================= */

const STORAGE_KEY = "e3rafnyCustomers";

// قراءة العملاء
function getCustomers() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
    } catch (error) {
        console.error(error);
        return [];
    }
}

// حفظ العملاء
function saveCustomers(customers) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(customers)
        );
        return true;
    } catch (error) {
        alert("مساحة التخزين غير كافية لحفظ البيانات أو الصور.");
        console.error(error);
        return false;
    }
}

// ضغط الصور قبل الحفظ
function readImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const canvas = document.createElement("canvas");
                const maxSize = 800;

                let width = image.width;
                let height = image.height;

                if (width > height && width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }

                canvas.width = width;
                canvas.height = height;

                canvas.getContext("2d").drawImage(
                    image, 0, 0, width, height
                );

                resolve(canvas.toDataURL("image/jpeg", 0.65));
            };

            image.onerror = reject;
            image.src = reader.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// عرض الإحصائيات والعملاء
function updateDashboard() {
    const customers = getCustomers();

    const customerCount =
        document.getElementById("customerCount");

    const pageCount =
        document.getElementById("pageCount");

    const customerList =
        document.getElementById("customerList");

    if (customerCount) {
        customerCount.textContent = customers.length;
    }

    if (pageCount) {
        pageCount.textContent =
            customers.filter(c => c.published !== false).length;
    }

    if (!customerList) return;

    customerList.innerHTML = "";

    customers.forEach(customer => {
        const item = document.createElement("div");
        item.className = "customer-item";

        const name = document.createElement("h3");
        name.textContent = customer.name || "بدون اسم";

        const bio = document.createElement("p");
        bio.textContent = customer.bio || "";

        const status = document.createElement("p");
        status.textContent =
            customer.published !== false ? "منشور" : "مسودة";

        const view = document.createElement("button");
view.textContent = "عرض الملف الشخصي";
view.onclick = () => {
    window.open(
        `../index.html?id=${customer.id}`,
        "_blank"
    );
};

const edit = document.createElement("button");
edit.textContent = "تعديل";
edit.onclick = () => editCustomer(customer.id);

        const remove = document.createElement("button");
        remove.textContent = "حذف";
        remove.onclick = () => deleteCustomer(customer.id);

        item.append(name, bio, status, view, edit, remove);
        customerList.appendChild(item);
    });
}

// إضافة عميل
async function addCustomer() {
    const name = document.getElementById("customerName").value.trim();
    const bio = document.getElementById("customerBio").value.trim();

    const hobbies =
        document.getElementById("customerHobbies").value.trim();

    const achievements =
        document.getElementById("customerAchievements").value.trim();

    const mainFile =
        document.getElementById("customerMainImage").files[0];

    const galleryFiles = Array.from(
        document.getElementById("customerGallery").files
    );

    const social = [
    { platform: "Instagram", url: document.getElementById("customerInstagram").value.trim() },
    { platform: "Facebook", url: document.getElementById("customerFacebook").value.trim() },
    { platform: "TikTok", url: document.getElementById("customerTikTok").value.trim() },
    { platform: "YouTube", url: document.getElementById("customerYouTube").value.trim() },
    { platform: "X", url: document.getElementById("customerX").value.trim() },
    { platform: "WhatsApp", url: document.getElementById("customerWhatsApp").value.trim() },
    { platform: "LinkedIn", url: document.getElementById("customerLinkedIn").value.trim() },
    { platform: "Website", url: document.getElementById("customerWebsite").value.trim() }
].filter(link => link.url);

    if (!name) {
        alert("اكتب اسم العميل أولاً");
        return;
    }

    if (galleryFiles.length > 5) {
        alert("يمكن إضافة 5 صور كحد أقصى");
        return;
    }

    try {
        const mainImage = mainFile
            ? await readImage(mainFile)
            : "";

        const images = await Promise.all(
            galleryFiles.map(file => readImage(file))
        );

        const customers = getCustomers();

        const newCustomer = {
            id: Date.now(),
            name,
            bio,
            hobbies,
            achievements,
            mainImage,
            images,
            social: social,
            published: true
        };

        customers.push(newCustomer);

        if (!saveCustomers(customers)) return;

        document.getElementById("customerName").value = "";
        document.getElementById("customerBio").value = "";
        document.getElementById("customerHobbies").value = "";
        document.getElementById("customerAchievements").value = "";
        document.getElementById("customerMainImage").value = "";
        document.getElementById("customerGallery").value = "";
        document.getElementById("customerInstagram").value = "";
document.getElementById("customerFacebook").value = "";
document.getElementById("customerTikTok").value = "";
document.getElementById("customerYouTube").value = "";
document.getElementById("customerX").value = "";
document.getElementById("customerWhatsApp").value = "";
document.getElementById("customerLinkedIn").value = "";
document.getElementById("customerWebsite").value = "";

        updateDashboard();

        alert("تمت إضافة العميل بنجاح!");

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء قراءة الصور. حاول بصور أصغر.");
    }
}

// تعديل العميل
function editCustomer(id) {
    const customers = getCustomers();

    const customer = customers.find(
        c => String(c.id) === String(id)
    );

    if (!customer) return;

    const name = prompt("اسم العميل:", customer.name || "");
    if (name === null) return;

    const bio = prompt("نبذة العميل:", customer.bio || "");
    if (bio === null) return;

    customer.name = name.trim() || customer.name;
    customer.bio = bio;

    if (saveCustomers(customers)) {
        updateDashboard();
        alert("تم تعديل بيانات العميل");
    }
}

// حذف العميل
function deleteCustomer(id) {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) {
        return;
    }

    const customers = getCustomers().filter(
        c => String(c.id) !== String(id)
    );

    if (saveCustomers(customers)) {
        updateDashboard();
        alert("تم حذف العميل");
    }
}

// تشغيل لوحة التحكم
document.addEventListener(
    "DOMContentLoaded",
    updateDashboard
);