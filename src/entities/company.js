
class Company {
    #id
    #name
    #cif
    #street
    #number
    #postal
    #city
    #province

    constructor(name, street, number, postal, city, province) {
        this.#name = name 
        this.#street = street
        this.#number = number
        this.#postal = postal
        this.#city = city 
        this.#province = province 
    }

    get name () { return this.#name }
    get street () { return this.#street }
    get number () { return this.#number }
    get postal () { return this.#postal }
    get province () { return this.#province }

    set name (name) { this.#name = name }
    set street (street) { this.#street = street }
    set number (number) { this.#number = number}
    set postal (postal) { this.#postal = postal }
    set province (province) { this.#province = province }
}

