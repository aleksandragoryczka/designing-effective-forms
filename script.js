let clickCount = 0;

const countryInput = document.getElementById('country');
const countryCodeInput = document.getElementById('countryCode');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');

        data.forEach(country => {
            getCountryCode(country.name.common);
        });
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            const countrySelect = document.getElementById('country');
            const defaultOption = countrySelect.querySelector('option[value="' + country + '"]');
            if (defaultOption) {
                defaultOption.selected = true;
            }

            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const root = data[0].idd.root;
            const suffixes = data[0].idd.suffixes;

            console.log(data[0])

            let countryCode = root;
            if (suffixes != undefined && suffixes.length === 1) {
                countryCode += suffixes[0];
            }

            countryCodeInput.innerHTML += `<option value="${countryCode}">${countryCode} (${countryName})</option>`;

            const countryCodeSelect = document.getElementById('countryCode');
            const defaultCountryCodeOption = countryCodeSelect.querySelector('option[value="' + countryCode + '"]');
            if (defaultCountryCodeOption) {
                defaultCountryCodeOption.selected = true;
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

document.addEventListener('click', handleClick);

document.addEventListener('DOMContentLoaded', function () {
    getCountryByIP();
    fetchAndFillCountries();
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const streetInput = document.getElementById('street');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const cityInput = document.getElementById('city');
    const zipCodeInput = document.getElementById('zipCode');
    const emailInput = document.getElementById('exampleInputEmail1');
    const vatNumberInput = document.getElementById('vatNumber');
    const invoiceDataInput = document.getElementById('invoiceData');
    const vatUECheckbox = document.getElementById('vatUE');
    const countryInput = document.getElementById('country');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        const inputs = [
            firstNameInput,
            lastNameInput,
            streetInput,
            phoneNumberInput,
            cityInput,
            zipCodeInput,
            emailInput,
            vatNumberInput,
            invoiceDataInput
        ];

        let isValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        function filterCountryOptions(inputValue) {
            const filteredOptions = countryOptionsArray.filter(option => {
                return option.textContent.toLowerCase().startsWith(inputValue.toLowerCase());
            });
    
            countryOptionsArray.forEach(option => {
                option.style.display = 'none';
            });
    
            filteredOptions.forEach(option => {
                option.style.display = 'block';
            });
        }
    
        countryInput.addEventListener('input', function(event) {
            const inputValue = event.target.value.trim();
            filterCountryOptions(inputValue);
        });

        if (isValid) {
            console.log('Formularz jest poprawnie wypełniony. Możesz przetwarzać dane.');
        } else {
            console.log('Formularz zawiera błędy. Sprawdź poprawność danych.');
        }

        form.classList.add('was-validated');
    });

    function validateInput(input) {
        if (input.checkValidity()) {
            input.classList.remove('is-invalid');
            return true;
        } else {
            input.classList.add('is-invalid');
            return false;
        }
    }

    form.addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            validateInput(event.target);
        }
    });

    firstNameInput.addEventListener('input', function(event) {
        const value = event.target.value.trim();
        const regex = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;

        if (value.length > 0 && !regex.test(value)) {
            event.target.setCustomValidity('Imię może zawierać tylko litery.');
        } else {
            event.target.setCustomValidity('');
        }
    });

    lastNameInput.addEventListener('input', function(event) {
        const value = event.target.value.trim();
        const regex = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;

        if (value.length > 0 && !regex.test(value)) {
            event.target.setCustomValidity('Nazwisko może zawierać tylko litery.');
        } else {
            event.target.setCustomValidity('');
        }
    });

    phoneNumberInput.addEventListener('input', function(event) {
        const value = event.target.value.trim();
        const regex = /^\d{9}$/;

        if (value.length > 0 && !regex.test(value)) {
            event.target.setCustomValidity('Numer telefonu komórkowego musi składać się z 9 cyfr.');
        } else {
            event.target.setCustomValidity('');
        }
    });

    zipCodeInput.addEventListener('input', function(event) {
        const value = event.target.value.trim();
        const regex = /^\d{2}-\d{3}$/;

        if (value.length > 0 && !regex.test(value)) {
            event.target.setCustomValidity('Kod pocztowy musi być w formacie 00-000.');
        } else {
            event.target.setCustomValidity('');
        }
    });
    
    async function fetchVatPrefix(countryName) {
        const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            const data = await response.json();
            const vatPrefix = data[0].cca2;
            return vatPrefix;
        } catch (error) {
            console.error('Wystąpił błąd:', error);
        }
    }

    countryInput.addEventListener('change', function(event) {
        const selectedCountry = event.target.value;
        fetchAndFillCountryCodes(selectedCountry);
        getCountryCode(selectedCountry);
    });

    vatUECheckbox.addEventListener('change', async function(event) {
        const vatNumberInput = document.getElementById('vatNumber');
        const vatPrefix = event.target.checked ? await fetchVatPrefix(countryInput.value) : '';
        vatNumberInput.value = vatPrefix;
    });
});
