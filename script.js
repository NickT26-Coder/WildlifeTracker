//Generate Wildlife Tracker Data
const API_KEY = '29wjGbIvvf0UYnYd6r3LEgRIVJYXroiZ936UKXea'
const base_URL = 'https://irmaservices.nps.gov/taxonomy/v2/rest/searchByCommonName/'
// const URL = 'https://developer.nps.gov/api/v1/parks?parkCode=Grsm&api_key=' + API_KEY
let animalCards = document.querySelector(".animal-cards.hide")


try {
    fetch("./animals.json")
    .then((response) => response.json())
    .then((json) => {
        getData(json)
    })
} catch(error) {
    console.log(error.message)
}

async function getData(animalData) {
    for (animal of Object.keys(animalData)) {
        let URL = base_URL
        URL += animal
        const response = await fetch(URL, {
            headers: {
              Authorization: API_KEY,
            }
        })
        try {
            if (!response.ok) {
                throw new Error("Unable to get resources")
            }
            const data = await response.json()
            data[0].image = animalData[animal].image
            data[0].image_source = animalData[animal].image_source
            data[0].website_link = animalData[animal].website_link
            data[0].description = animalData[animal].description
            data[0].fun_fact = animalData[animal].fun_fact
            addAnimal(data)//Change?
        } catch(error) {
                console.error(error)
        }
    }
    animalCards.classList.toggle("hide")
    animalCards.previousElementSibling.remove()
    addSearchBar()
}

function addAnimal(data) {
    animalCards = document.querySelector(".animal-cards.hide")
    const animalContainer = document.createElement("div")
    const imageAnchor = document.createElement("a")
    const animalImage = document.createElement("img")
    const animalDesc = document.createElement("div")
    const checkboxContainer = document.createElement("div")
    const animalH2 = document.createElement("h2")
    const tooltipSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const toolTipPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    const animalUL = document.createElement("ul")
    const [scientificName, animalType, webLinkList] = Array.from({ length: 3 }, () => document.createElement("li"));
    const webLink = document.createElement("a")
    const [toolTipContent, animalPara, imageCredit] = Array.from({ length: 3 }, () => document.createElement("p"));
    const checkmark = document.createElement("span")
    const checkbox = document.createElement("input")
    animalContainer.classList.add("container")
    animalCards.appendChild(animalContainer)
    imageAnchor.classList.add("hideOnMobile")
    imageAnchor.href = data[0].website_link
    animalImage.src = data[0].image
    imageAnchor.setAttribute("target", "_blank")
    animalImage.alt = data[0].CommonNames[0].toUpperCase()
    imageAnchor.appendChild(animalImage)
    animalDesc.classList.add("animal-description")
    checkboxContainer.classList.add("checkbox-container")
    animalContainer.append(imageAnchor, animalDesc, checkboxContainer)
    //Header Content
    animalH2.textContent = data[0].CommonNames[0].toUpperCase()
    tooltipSvg.classList.add("hideOnMobile")
    tooltipSvg.setAttribute("viewBox", "0 0 384 512")
    toolTipPath.classList.add("tooltip-icon")
    toolTipPath.setAttribute("d", "M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z")
    toolTipContent.classList.add("tooltip-content")
    toolTipContent.textContent = data[0].fun_fact
    tooltipSvg.appendChild(toolTipPath)
    animalDesc.append(animalH2, tooltipSvg, toolTipContent, animalUL)
    addToolTipContent(toolTipPath)
    //Subheading Content
    animalUL.append(scientificName, animalType, webLinkList)
    scientificName.textContent = data[0].ScientificName
    animalType.textContent = data[0].NPSpeciesCategory
    webLinkList.appendChild(webLink)
    webLink.href = data[0].website_link
    webLink.textContent = "More Info"
    webLink.setAttribute("target", "_blank")
    //Paragraph
    animalDesc.append(animalPara, imageCredit)
    animalPara.textContent = data[0].description
    imageCredit.classList.add("font-sm")
    imageCredit.textContent = data[0].image_source
    //Checkbox
    checkboxContainer.append(checkmark, checkbox)
    checkmark.classList.add("checkmark")
    checkbox.setAttribute("type", "checkbox")
}

//Tooltip
function addToolTipContent(tooltip) {
    tooltip.addEventListener("mouseover", (e) => {
        const animalDesc = tooltip.parentElement.parentElement; 
        let toolTipIcon = tooltip.parentElement;
        let toolTipContent = toolTipIcon.nextElementSibling;
        toolTipContent.classList.add("open");

        toolTipContent.style.bottom = animalDesc.clientHeight + "px";
    })

    tooltip.addEventListener("mouseout", (e) => {
        document.querySelectorAll(".tooltip-content").forEach((tooltip) => {
            tooltip.classList.remove("open");
        });
    })
}

//Sidebar
function showSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

//Searchbar
function addSearchBar() {
    const searchInput = document.querySelector("[data-search]")
    const animalCards = document.querySelectorAll(".container")
    searchInput.addEventListener("input", (e) => {
        const input = e.target.value.toLowerCase()
        animalCards.forEach((animal) => {
            let animalName = animal.querySelector("h2").textContent.toLowerCase()
            if (!animalName.includes(input)) {
                animal.classList.add("hide")
            }
            else {
                animal.classList.remove("hide")
            }
        }) 
    });
}