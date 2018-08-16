const winIndex = OS.indexOf('win') 
const macIndex = OS.indexOf('mac')
const linuxIndex = OS.indexOf('linux')

let vue = new Vue({
    el: '.contentside',
    data: {
        filterQuery: '',
        filterIsActive: false,
        selectedOS: '',
        showOS: false
    },
    methods: {
        containsFilter: function (value) {
            return value.toLowerCase().indexOf(this.filterQuery.toLowerCase()) !== -1
        },
        highlight: function (value) {
            return this.filterQuery === '' ? value : value.replace(new RegExp(this.filterQuery, 'gi'), '<mark>$&</mark>')
        },
        showOSAsAnOption: function (os) {
            if (this.selectedOS === os) {
                return false
            }
            if (OS.indexOf(os) === -1) {
                return false
            }
            return true
        }
    }
})

let userOS = 'win'
if (navigator.platform.toLowerCase().indexOf('mac') !== -1) {
    userOS = 'mac'
} else if (navigator.platform.toLowerCase().indexOf('linux') !== -1) {
    userOS = 'linux'
}
if (OS.indexOf(userOS) !== -1) {
    vue.selectedOS = userOS
} else {
    if (OS.indexOf('win') !== -1) {
        vue.selectedOS = 'win'
    } else {
        vue.selectedOS = OS[0]
    }
}