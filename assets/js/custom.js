/**
 * LD11: JavaScript Formos ir Validacija
 * Custom JavaScript for CV website - Laboratorinis darbas 11
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom.js loaded successfully - LD11');

    /**
     * 2. Kontaktų formos atnaujinimas
     */
    updateContactForm();

    /**
     * Papildomi funkcionalumai
     */
    initCustomAnimations();
    initRealTimeValidation();
    initPhoneNumberFormatting();
    updateSubmitButtonState();
});

/**
 * 2a. Kontaktų formos atnaujinimas
 */
function updateContactForm() {
    const contactForm = document.querySelector('.php-email-form');
    
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }

    // Pašaliname PHP atributus iš formos
    contactForm.removeAttribute('action');
    contactForm.removeAttribute('method');
    contactForm.removeAttribute('enctype');
    
    // Pridedame savo klasę
    contactForm.className = 'custom-contact-form';

    // Sukuriame naują formą
    const newFormHTML = `
        <div class="row gy-4">
            <div class="col-md-6">
                <label for="firstName" class="pb-2">Vardas *</label>
                <input type="text" name="firstName" id="firstName" class="form-control" required>
                <div class="field-error" id="firstNameError"></div>
            </div>

            <div class="col-md-6">
                <label for="lastName" class="pb-2">Pavardė *</label>
                <input type="text" name="lastName" id="lastName" class="form-control" required>
                <div class="field-error" id="lastNameError"></div>
            </div>

            <div class="col-md-6">
                <label for="email" class="pb-2">El. paštas *</label>
                <input type="email" name="email" id="email" class="form-control" required>
                <div class="field-error" id="emailError"></div>
            </div>

            <div class="col-md-6">
                <label for="phone" class="pb-2">Telefono numeris</label>
                <input type="tel" name="phone" id="phone" class="form-control" placeholder="+370 6xx xxxxx" maxlength="15">
                <div class="field-error" id="phoneError"></div>
            </div>

            <div class="col-12">
                <label for="address" class="pb-2">Adresas</label>
                <textarea name="address" id="address" class="form-control" rows="2"></textarea>
                <div class="field-error" id="addressError"></div>
            </div>

            <!-- Vertinimo klausimai -->
            <div class="col-12">
                <h5 class="mt-4 mb-3">Vertinimo klausimai (1-10 balų skalėje)</h5>
                
                <!-- Klausimas 1: Slankiklis -->
                <div class="rating-question mb-4">
                    <label for="rating1" class="form-label">1. Kaip vertinate mano profesinius įgūdžius?</label>
                    <div class="d-flex align-items-center">
                        <span class="me-2">1</span>
                        <input type="range" name="rating1" id="rating1" class="form-range" min="1" max="10" value="5">
                        <span class="ms-2">10</span>
                        <span class="ms-3 rating-value" id="rating1Value">5</span>
                    </div>
                </div>

                <!-- Klausimas 2: Radio mygtukai -->
                <div class="rating-question mb-4">
                    <label class="form-label">2. Kaip vertinate mano komunikacinius gebėjimus?</label>
                    <div class="rating-radio-group">
                        ${generateRadioButtons('rating2', 5)}
                    </div>
                </div>

                <!-- Klausimas 3: Skaičiaus pasirinkimas -->
                <div class="rating-question mb-4">
                    <label for="rating3" class="form-label">3. Kaip vertinate mano patirtį šioje srityje?</label>
                    <select name="rating3" id="rating3" class="form-select">
                        <option value="">Pasirinkite įvertinimą</option>
                        ${generateSelectOptions()}
                    </select>
                </div>
            </div>

            <div class="col-12">
                <label for="message" class="pb-2">Papildoma informacija</label>
                <textarea name="message" id="message" class="form-control" rows="5"></textarea>
            </div>

            <!-- Rezultatų atvaizdavimo sritis -->
            <div class="col-12" id="formResultsContainer" style="display: none;">
                <div class="results-card p-4 mt-4 bg-light rounded">
                    <h4 class="mb-3">Pateikti duomenys:</h4>
                    <div id="formResults"></div>
                    <div id="averageRating" class="mt-3 p-3 bg-primary text-white rounded"></div>
                </div>
            </div>

            <div class="col-md-12 text-center">
                <div class="loading">Siunčiama...</div>
                <div class="error-message"></div>
                <div class="sent-message">Jūsų žinutė sėkmingai išsiųsta! Ačiū.</div>

                <button type="submit" class="btn-animated" id="submitBtn" disabled>Siųsti</button>
            </div>
        </div>
    `;

    // Pakeičiame formos turinį
    contactForm.innerHTML = newFormHTML;

    // Inicijuojame funkcionalumą
    initRatingSlider();
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Pridedame realaus laiko validaciją
    initRealTimeValidationListeners();
}

/**
 * Sugeneruoja radio mygtukus vertinimui
 */
function generateRadioButtons(name, defaultValue) {
    let html = '<div class="d-flex flex-wrap gap-3">';
    for (let i = 1; i <= 10; i++) {
        const checked = i === defaultValue ? 'checked' : '';
        html += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="${name}" id="${name}_${i}" value="${i}" ${checked}>
                <label class="form-check-label" for="${name}_${i}">${i}</label>
            </div>
        `;
    }
    html += '</div>';
    return html;
}

/**
 * Sugeneruoja pasirinkimo lauko parinktis
 */
function generateSelectOptions() {
    let html = '';
    for (let i = 1; i <= 10; i++) {
        html += `<option value="${i}">${i}</option>`;
    }
    return html;
}

/**
 * Inicijuoja slankiklio funkcionalumą
 */
function initRatingSlider() {
    const slider = document.getElementById('rating1');
    const valueDisplay = document.getElementById('rating1Value');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
            updateSubmitButtonState();
        });
    }
}

/**
 * Formos pateikimo apdorojimas - 4. UŽDUOTIS
 */
function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation(); // Papildomai sustabdo event plitimą
    
    console.log('Forma pateikta sėkmingai (be PHP backend)');
    
    const form = event.target;
    const formData = collectFormData();
    
    // Rodyti įkėlimo animaciją
    showLoadingState(form, true);
    
    // Simuliuojame formos siuntimą (be PHP)
    setTimeout(() => {
        if (validateForm(formData)) {
            // 4a. Išvedame į konsolę
            console.log('Formos duomenys:', formData);
            
            // 4b. Atvaizduojame formos apačioje
            displayFormResults(formData);
            
            // 5. Apskaičiuojame ir atvaizduojame vidurkį
            displayAverageRating(formData);
            
            // 6. Rodyti sėkmės pranešimą
            showSuccessPopup();
            
            showSuccessMessage(form);
            form.reset();
            resetRatingDisplay();
            updateSubmitButtonState();
        } else {
            showErrorMessage(form, 'Prašome užpildyti visus privalomus laukus teisingai.');
        }
        showLoadingState(form, false);
    }, 1500);
}

/**
 * Surinkti formos duomenis
 */
function collectFormData() {
    return {
        firstName: document.getElementById('firstName')?.value.trim(),
        lastName: document.getElementById('lastName')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        phone: document.getElementById('phone')?.value.trim(),
        address: document.getElementById('address')?.value.trim(),
        rating1: parseInt(document.getElementById('rating1')?.value) || 0,
        rating2: parseInt(getSelectedRadioValue('rating2')) || 0,
        rating3: parseInt(document.getElementById('rating3')?.value) || 0,
        message: document.getElementById('message')?.value.trim()
    };
}

/**
 * Gauti pasirinkto radio mygtuko reikšmę
 */
function getSelectedRadioValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
}

/**
 * 4. Atvaizduoti formos rezultatus
 */
function displayFormResults(formData) {
    const resultsContainer = document.getElementById('formResultsContainer');
    const resultsContent = document.getElementById('formResults');
    
    if (!resultsContainer || !resultsContent) return;
    
    const resultsHTML = `
        <p><strong>Vardas:</strong> ${formData.firstName || 'Nenurodyta'}</p>
        <p><strong>Pavardė:</strong> ${formData.lastName || 'Nenurodyta'}</p>
        <p><strong>El. paštas:</strong> ${formData.email || 'Nenurodyta'}</p>
        <p><strong>Tel. numeris:</strong> ${formData.phone || 'Nenurodyta'}</p>
        <p><strong>Adresas:</strong> ${formData.address || 'Nenurodyta'}</p>
        <p><strong>Profesiniai įgūdžiai:</strong> ${formData.rating1}/10</p>
        <p><strong>Komunikaciniai gebėjimai:</strong> ${formData.rating2}/10</p>
        <p><strong>Patirtis srityje:</strong> ${formData.rating3}/10</p>
        <p><strong>Papildoma informacija:</strong> ${formData.message || 'Nėra'}</p>
    `;
    
    resultsContent.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';
}

/**
 * 5. Apskaičiuoti ir atvaizduoti vidurkį
 */
function displayAverageRating(formData) {
    const averageContainer = document.getElementById('averageRating');
    if (!averageContainer) return;
    
    const ratings = [formData.rating1, formData.rating2, formData.rating3];
    const validRatings = ratings.filter(rating => rating > 0);
    
    if (validRatings.length > 0) {
        const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
        const formattedAverage = average.toFixed(1);
        
        averageContainer.innerHTML = `
            <h5 class="mb-0">${formData.firstName} ${formData.lastName}: ${formattedAverage}</h5>
            <small>Trių klausimų įvertinimų vidurkis</small>
        `;
    }
}

/**
 * 6. Rodyti sėkmingo pateikimo pop-up pranešimą
 */
function showSuccessPopup() {
    // Sukuriame pop-up elementą
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">✓</div>
            <h4>Duomenys pateikti sėkmingai!</h4>
            <p>Ačiū už jūsų atsiliepimą. Susisieksime su jumis artimiausiu metu.</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Gerai</button>
        </div>
    `;
    
    // Pridedame stilius
    const style = document.createElement('style');
    style.textContent = `
        .success-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .popup-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
        }
        .popup-icon {
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 1rem;
        }
        .popup-content h4 {
            color: #28a745;
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(popup);
    
    // Automatiškai pašaliname po 5 sekundžių
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 5000);
}

/**
 * Formos validacija
 */
function validateForm(formData) {
    // Patikrinti privalomus laukus
    if (!formData.firstName || !formData.lastName || !formData.email) {
        return false;
    }
    
    // Patikrinti el. pašto formatą
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return false;
    }
    
    // Patikrinti vardą ir pavardę (tik raidės)
    const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/;
    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
        return false;
    }
    
    return true;
}

/**
 * PAPILDOMA UŽDUOTIS: Realaus laiko validacija
 */
function initRealTimeValidationListeners() {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
            field.addEventListener('input', () => {
                validateField(fieldId);
                updateSubmitButtonState();
            });
        }
    });
    
    // Vertinimo laukų pakeitimai
    const ratingFields = ['rating1', 'rating3'];
    ratingFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', updateSubmitButtonState);
        }
    });
    
    // Radio mygtukai
    const radioButtons = document.querySelectorAll('input[type="radio"][name="rating2"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateSubmitButtonState);
    });
}

/**
 * Validuoti atskirą lauką
 */
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    const value = field.value.trim();
    
    if (!errorElement) return;
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                errorMessage = 'Šis laukas yra privalomas';
                isValid = false;
            } else if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(value)) {
                errorMessage = 'Vardas ir pavardė gali būti sudaryti tik iš raidžių';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Šis laukas yra privalomas';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Įveskite teisingą el. pašto adresą';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (value && !/^\+370\s6\d{2}\s\d{5}$/.test(value)) {
                errorMessage = 'Telefono numeris turi atitikti formatą: +370 6xx xxxxx';
                isValid = false;
            }
            break;
            
        case 'address':
            if (value && !/^[a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ\s\-,.]+$/.test(value)) {
                errorMessage = 'Adresas gali būti sudarytas tik iš raidžių, skaičių ir pagrindinių skyrybos ženklų';
                isValid = false;
            }
            break;
    }
    
    // Atnaujinti lauko būseną
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        errorMessage = '';
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    errorElement.textContent = errorMessage;
    return isValid;
}

/**
 * PAPILDOMA UŽDUOTIS: Patobulintas telefono numerio formatavimas
 */
function initPhoneNumberFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    let isFormatting = false;

    phoneInput.addEventListener('input', function(e) {
        if (isFormatting) return;
        
        let value = e.target.value.replace(/\D/g, '');
        
        // Jei vartotojas bando vesti numerį be +370, pridedame automatiškai
        if (value.length > 0 && !value.startsWith('370')) {
            value = '370' + value;
        }
        
        // Apribojame iki 11 skaitmenų (370 + 8 skaitmenys)
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Formatuojame tik jei turime pakankamai skaitmenų
        if (value.length >= 4) {
            isFormatting = true;
            
            let formatted = '+';
            
            // Šalies kodas
            formatted += value.substring(0, 3) + ' ';
            
            // Operatoriaus kodas (6xx)
            formatted += value.substring(3, 4); // 6
            
            if (value.length >= 5) {
                formatted += value.substring(4, 5);
            } else {
                formatted += 'x';
            }
            
            if (value.length >= 6) {
                formatted += value.substring(5, 6);
            } else {
                formatted += 'x';
            }
            
            // Likę skaitmenys
            if (value.length >= 7) {
                formatted += ' ' + value.substring(6, 7);
            } else {
                formatted += ' x';
            }
            
            if (value.length >= 8) {
                formatted += value.substring(7, 8);
            } else if (value.length >= 7) {
                formatted += 'x';
            }
            
            if (value.length >= 9) {
                formatted += value.substring(8, 9);
            } else if (value.length >= 7) {
                formatted += 'x';
            }
            
            if (value.length >= 10) {
                formatted += value.substring(9, 10);
            } else if (value.length >= 7) {
                formatted += 'x';
            }
            
            if (value.length >= 11) {
                formatted += value.substring(10, 11);
            } else if (value.length >= 7) {
                formatted += 'x';
            }
            
            this.value = formatted;
            isFormatting = false;
        } else if (value.length > 0) {
            // Jei skaitmenų mažiau nei 4, rodome tik šalies kodą
            this.value = '+370 ';
        }
        
        validateField('phone');
        updateSubmitButtonState();
    });

    // Blokuoti ne skaitmenų įvedimą
    phoneInput.addEventListener('keydown', function(e) {
        // Leidžiame visus valdymo klavišus
        if ([
            'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 
            'Home', 'End', 'Enter', 'Escape'
        ].includes(e.key)) {
            return;
        }
        
        // Leidžiame skaitmenis
        if (e.key >= '0' && e.key <= '9') {
            return;
        }
        
        // Visus kitus klavišus blokuojame
        e.preventDefault();
    });

    // Papildoma validacija kai laukas praranda fokusą
    phoneInput.addEventListener('blur', function() {
        const value = this.value.replace(/\D/g, '');
        
        // Jei vartotojas įvedė mažiau nei 8 skaitmenų (po 370), rodome klaidą
        if (value.length > 3 && value.length < 11) {
            const errorElement = document.getElementById('phoneError');
            if (errorElement) {
                errorElement.textContent = 'Įveskite pilną telefono numerį (8 skaitmenys po +370)';
            }
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        } else if (value.length === 11) {
            // Pilnas numeris - validuojame kaip teisingą
            validateField('phone');
        }
        
        updateSubmitButtonState();
    });
    
    // Išvalyti klaidas kai vartotojas vėl pradeda vesti
    phoneInput.addEventListener('focus', function() {
        const errorElement = document.getElementById('phoneError');
        if (errorElement) {
            errorElement.textContent = '';
        }
        this.classList.remove('is-invalid');
    });
}

/**
 * PAPILDOMA UŽDUOTIS: Submit mygtuko būsenos valdymas
 */
function updateSubmitButtonState() {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    const requiredFields = ['firstName', 'lastName', 'email'];
    const allFields = ['firstName', 'lastName', 'email', 'phone', 'address'];
    
    // Tikriname ar yra klaidų bet kuriame lauke
    const hasErrors = allFields.some(fieldId => {
        const field = document.getElementById(fieldId);
        return field && field.classList.contains('is-invalid');
    });
    
    // Tikriname ar užpildyti privalomi laukai
    const allRequiredFilled = requiredFields.every(fieldId => {
        const field = document.getElementById(fieldId);
        return field && field.value.trim() !== '';
    });
    
    // Tikriname ar privalomi laukai teisingai užpildyti
    const allRequiredValid = requiredFields.every(fieldId => {
        const field = document.getElementById(fieldId);
        return field && field.classList.contains('is-valid');
    });
    
    // Patikrinti ar bent vienas vertinimas pasirinktas
    const rating1 = parseInt(document.getElementById('rating1')?.value) || 0;
    const rating2 = parseInt(getSelectedRadioValue('rating2')) || 0;
    const rating3 = parseInt(document.getElementById('rating3')?.value) || 0;
    const hasRating = rating1 > 0 || rating2 > 0 || rating3 > 0;
    
    // Submit mygtukas aktyvus tik jei:
    // - Nėra klaidų jokiame lauke
    // - Visi privalomi laukai užpildyti
    // - Visi privalomi laukai teisingi
    // - Bent vienas vertinimas pasirinktas
    submitBtn.disabled = hasErrors || !allRequiredFilled || !allRequiredValid || !hasRating;
}

/**
 * Pagalbinės funkcijos
 */
function showLoadingState(form, show) {
    const loading = form.querySelector('.loading');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (loading && submitBtn) {
        loading.style.display = show ? 'block' : 'none';
        submitBtn.disabled = show;
    }
}

function showSuccessMessage(form) {
    const successMsg = form.querySelector('.sent-message');
    const errorMsg = form.querySelector('.error-message');
    
    if (successMsg && errorMsg) {
        errorMsg.style.display = 'none';
        successMsg.style.display = 'block';
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }
}

function showErrorMessage(form, message) {
    const errorMsg = form.querySelector('.error-message');
    const successMsg = form.querySelector('.sent-message');
    
    if (errorMsg && successMsg) {
        successMsg.style.display = 'none';
        errorMsg.innerHTML = message;
        errorMsg.style.display = 'block';
    }
}

function resetRatingDisplay() {
    const ratingValue = document.getElementById('rating1Value');
    if (ratingValue) {
        ratingValue.textContent = '5';
    }
    
    const slider = document.getElementById('rating1');
    if (slider) {
        slider.value = 5;
    }
    
    const select = document.getElementById('rating3');
    if (select) {
        select.value = '';
    }
}

/**
 * Papildomos animacijos ir efektai
 */
function initCustomAnimations() {
    // Pridedame hover efektus vertinimo klausimams
    const ratingQuestions = document.querySelectorAll('.rating-question');
    ratingQuestions.forEach(question => {
        question.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        question.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * Inicijuoti realaus laiko validaciją
 */
function initRealTimeValidation() {
    // Jau įgyvendinta initRealTimeValidationListeners()
}

console.log('Custom JavaScript functionality loaded - LD11 requirements fulfilled');