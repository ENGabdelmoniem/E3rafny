document.addEventListener("DOMContentLoaded", function () {

    const customers = JSON.parse(
        localStorage.getItem("e3rafnyCustomers") || "[]"
    );

    const params = new URLSearchParams(window.location.search);
    const customerId = params.get("id");

    const customer = customers.find(
        person => String(person.id) === customerId
    );

    if (!customer) {
        document.querySelector(".profile-page").textContent =
            "العميل غير موجود.";
        return;
    }

    // بيانات العميل
    document.getElementById("personName").textContent =
        customer.name || "";

    document.getElementById("personBio").textContent =
        customer.bio || "";

    document.getElementById("personHobbies").textContent =
        customer.hobbies || "";

    document.getElementById("personAchievements").textContent =
        customer.achievements || "";

    // الصورة الشخصية
    const mainImage = document.getElementById("personImage");

    if (mainImage && customer.mainImage) {
        mainImage.src = customer.mainImage;
        mainImage.style.cursor = "pointer";
    }

    // معرض الصور
    const gallery = document.getElementById("gallery");
    const galleryImages = customer.images || [];

    const viewer = document.getElementById("imageViewer");
    const viewerImage = document.getElementById("viewerImage");
    const imageCounter = document.getElementById("imageCounter");

    let currentImageIndex = 0;

    function showImage(index) {
        if (!galleryImages.length || !viewer || !viewerImage) return;

        currentImageIndex =
            (index + galleryImages.length) % galleryImages.length;

        viewerImage.src = galleryImages[currentImageIndex];

        if (imageCounter) {
            imageCounter.textContent =
                `${currentImageIndex + 1} / ${galleryImages.length}`;
        }

        viewer.classList.add("active");
    }

    if (gallery) {
        gallery.innerHTML = "";

        galleryImages.forEach((image, index) => {
            const img = document.createElement("img");

            img.src = image;
            img.alt = "صورة من معرض العميل";
            img.onclick = () => showImage(index);

            gallery.appendChild(img);
        });
    }

    // تكبير الصورة الشخصية داخل نافذة العرض
    if (mainImage && customer.mainImage) {
        mainImage.onclick = () => {
            if (!viewer || !viewerImage) return;

            viewerImage.src = customer.mainImage;
            viewer.classList.add("active");

            if (imageCounter) {
                imageCounter.textContent = "الصورة الشخصية";
            }
        };
    }

    // أزرار نافذة الصور
    const closeButton = document.getElementById("closeViewer");
    const prevButton = document.getElementById("prevImage");
    const nextButton = document.getElementById("nextImage");

    if (closeButton && viewer) {
        closeButton.onclick = () => {
            viewer.classList.remove("active");
        };
    }

    if (prevButton) {
        prevButton.onclick = () => {
            showImage(currentImageIndex - 1);
        };
    }

    if (nextButton) {
        nextButton.onclick = () => {
            showImage(currentImageIndex + 1);
        };
    }

    if (viewer) {
        viewer.onclick = (event) => {
            if (event.target === viewer) {
                viewer.classList.remove("active");
            }
        };
    }

    // التنقل بالأسهم ولوحة المفاتيح
    document.addEventListener("keydown", (event) => {
        if (!viewer || !viewer.classList.contains("active")) return;

        if (event.key === "Escape") {
            viewer.classList.remove("active");
        }

        if (event.key === "ArrowRight") {
            showImage(currentImageIndex - 1);
        }

        if (event.key === "ArrowLeft") {
            showImage(currentImageIndex + 1);
        }
    });

    // روابط التواصل الاجتماعي
    const socialContainer = document.getElementById("socialLinks");

    if (socialContainer) {
        socialContainer.innerHTML = "";

        (customer.social || []).forEach(link => {
            if (!link.url) return;

            const a = document.createElement("a");

            a.textContent = link.platform;
            a.href = link.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            socialContainer.appendChild(a);
        });
    }

});