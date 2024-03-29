/**
 * MIT License
 *
 * Copyright (C) 2021 <FacuFalcone - CaidevOficial>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * You should have received a copy of the MIT license
 * along with this program.  If not, see <https://opensource.org/licenses/MIT>.
 *
 * @author Facundo Falcone <CaidevOficial> 
 */

export const divSpinner = document.getElementById("spinner");

/**
 * Creates an object spinner-like.
 * @returns A spinner.
 */
const getSpinner = () => {
    let spinner = document.createElement('img');
    spinner.setAttribute('src', '../assets/keyboard.gif');
    spinner.setAttribute('alt', 'Spinner');
    divSpinner.appendChild( spinner);
}

/**
 * Removes all the nodes of the object.
 */
const clearSpinner = () => {
    while(divSpinner.hasChildNodes()){
        divSpinner.removeChild(divSpinner.firstChild);
    }
}

/**
 * Toogles the spinner bassed on the boolean.
 * @param {bool} bool The boolean to use to toogle the spinner.
 */
export const ToggleSpinner = (bool) => {
    if (bool){
        getSpinner();
    }else{
        clearSpinner();
    }
}

/**
 * Toggles the spinner on the page for 'seconds' seconds.
 * @param {int} seconds The seconds to wait before toogle the spinner.
 */
export const autoToggleSpinner = (seconds) => {
    ToggleSpinner(true);
    setTimeout(() => {
        ToggleSpinner(false);
    }, (Number(seconds)*1000));
}
