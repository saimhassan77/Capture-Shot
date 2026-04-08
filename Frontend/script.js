const state = {
  url: "",
  captureMode: "full", // full | viewport
  resolution: {
    width: 1920,
    height: 1080,
  },
  custom: false,
};

const urlInput = document.querySelector(".input-url input");
const captureBtn = document.querySelector(".input-url button");
const pageButtons = document.querySelectorAll(".options[data-type='page']");
const ratioItems = document.querySelectorAll(".resolution-opt .ratios:not(.custom-box)");
const custombox = document.querySelector(".custom-box");
const customratio = document.querySelector(".custom-ratio");
const customWidth = document.querySelector(".custom-ratio .custom:nth-child(1) input");
const customHeight = document.querySelector(".custom-ratio .custom:nth-child(3) input");
const downloadBtn = document.querySelector(".download-link");
const copyBtn = document.querySelector(".copy-btn");

function setActivePageButton() {
  pageButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === state.captureMode);
  });
}

pageButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    state.captureMode = btn.dataset.value;
    setActivePageButton();
  });
});

function setActiveRatioItem(selectedItem) {
  ratioItems.forEach(item => item.classList.remove("active"));
  custombox.classList.toggle("active", !selectedItem);
  if (selectedItem) selectedItem.classList.add("active");
}

ratioItems.forEach(item => {
  item.addEventListener("click", () => {
    const textNodes = Array.from(item.querySelectorAll("p")).map(p => p.textContent.trim());
    const resolutionText = textNodes[1] || "1920 x 1080";
    const [w, h] = resolutionText.split("x").map(n => Number(n.trim()));
    if (!Number.isNaN(w) && !Number.isNaN(h)) {
      state.resolution.width = w;
      state.resolution.height = h;
      state.custom = false;
    }
    customratio.classList.remove("open");
    setActiveRatioItem(item);
  });
});

custombox.addEventListener("click", () => {
  customratio.classList.toggle("open");
  state.custom = true;
  setActiveRatioItem(null);
});

function readCustomRatio() {
  const w = Number(customWidth.value || customWidth.placeholder || "1920");
  const h = Number(customHeight.value || customHeight.placeholder || "1080");
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
    state.resolution.width = w;
    state.resolution.height = h;
  }
}

const img = document.querySelector(".img-screen img");
const previewScreen = document.querySelector(".preview-container");
const loader = document.querySelector(".preview-screen .loading");
const captureScreen = document.querySelector(".preview-screen .capture-text");
const imgscreen = document.querySelector(".img-screen")
const previewurl = document.querySelector(".preview-url input");
const copysvg = document.querySelector(".copy-btn svg");
 const textpreview = document.querySelector(".capture-text p");
 const previewbtns = document.querySelector(".preview-header .preview-btns");

captureBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  imgscreen.style.display = "none"
  captureScreen.style.display = "flex"

  state.url = urlInput.value.trim();
  if (state.url.length === 0) {
    console.warn("URL is empty. Please add a URL to capture.");
    alert("Please enter a URL to capture.");
    captureScreen.style.display = "flex";
   loader.style.display = "none";
  
  }else{
    try {
       if(!state.url.startsWith("http://") && !state.url.startsWith("https://")){
       state.url = "https://" + state.url;
       previewurl.value = state.url;
    }else{
       previewurl.value = state.url;
     }
     captureScreen.style.display = "none";
     loader.style.display = "flex";

     previewScreen.scrollIntoView({ 
         behavior: "smooth",
        block: "center",
        delay: 900
  });

  

      const response = await fetch("https://capture-shot-production.up.railway.app/api/v1/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: state.url,
          Width: state.resolution.width,
          Height: state.resolution.height,
          pageSize: state.captureMode
        })
      });

      if(!response.ok){
        throw new Error(`API request failed with status ${response.status}`)
      }
        const data = await response.json();
        console.log("API response data:", data);
        
       
          img.onload = () =>{
          loader.style.display = "none"
          imgscreen.style.display = "flex"
          previewbtns.style.display = "flex";
          }
           img.onerror = () =>{
           loader.style.display = "none"
          captureScreen.style.display = "flex";
          textpreview.textContent = "Failed to load image. Please check the URL and try again.";
         console.error("Failed to load image. Please check the URL and try again.");
         }

         img.src = data.data
         
         

    } catch (err) {
      console.error(err);
      captureScreen.style.display = "flex";
      loader.style.display = "none";
      textpreview.textContent = "Failed to capture screenshot. Please check the URL and try again";
      return;
    }

 

  }
 

  if (state.custom) {
    readCustomRatio();
  }

});

//Downlaod button functionality
    downloadBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
          const response = await fetch(img.src);
        const blob = await response.blob();
        const bloburl = window.URL.createObjectURL(blob);

        //create temporaary link
        const link = document.createElement("a");
        link.href = bloburl;
        link.download = `screenshot ${state.resolution.width} x ${state.resolution.height}.png`;
        document.body.appendChild(link);
        link.click();

        //remove memory wastage
        document.body.removeChild(link);
        window.URL.revokeObjectURL(bloburl);
      } catch (error) {
          console.log("Error downloading image: ", error);
          window.open(img.src, "_blank");
      }
   })
 //Copy button functionality
    copyBtn.addEventListener("click", () => {
      
      let copytext = img.src;
      
      navigator.clipboard.writeText(copytext).then(() => {
        console.log("Image URL copied to clipboard: ", copytext);
        // Save original HTML

        copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Box -->
  <rect x="1" y="1" width="10" height="10" rx="1"
        stroke="currentColor" stroke-width="1.1" fill="none"/>
  
  <!-- Checkmark -->
  <path d="M3 6.5L5.2 8.5L9 3.5"
        stroke="currentColor"
        stroke-width="1.1"
        stroke-linecap="round"
        stroke-linejoin="round"/>
</svg> Copied`;
setTimeout(() => {
          copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="3" width="7" height="8" rx="1" stroke="currentColor" stroke-width="1.1"></rect><path d="M4 3V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1" stroke="currentColor" stroke-width="1.1"></path></svg> Copy Link`;
        }, 2000);
        
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });

    })

setActivePageButton();
setActiveRatioItem(ratioItems[0]);



