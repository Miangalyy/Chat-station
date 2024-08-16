import { createStore } from "vuex";

export default createStore({
    state() {
        return {
            messages: [],
            contacts: []
        }
    },

    mutations: {

        setContacts (state, newContacts) {
            state.contacts = newContacts
        },

        appendMessage (state, newMessage) {
            state.messages.push(newMessage)
        },

        prependMessage (state, newMessage) {
            state.messages.unshift(newMessage)
        },
        
        setMessages (state, newMessages) {
            state.messages = newMessages
        },
    },

    getters: {

        getContacts (state) {
            return state.contacts
        },

        getMessages (state) {
            return state.messages
        }
    }
})