<template>
    <div>
        <div class="container">
            <div class="row clearfix">
                <div class="col-lg-12">
                    <div class="card chat-app">
                        <div class="chat">
                            <div class="chat-header clearfix">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                           <img src="../../public/images/photo.jpg" alt="avatar" style="width: 75px; height: 75px; border-radius: 50%;">  
                                        </a>
    
                                        <div class="chat-about">
                                            <!-- recever name goes here-->
                                            <h6 class="m-b-0 text-white" v-if="receiver != null" v-text="receiver.name" style="margin-bottom: 0px; position: relative; top: 30px; right: 8px;"></h6>
                                        </div>
                                    </div>
    
                                    <div class="col-lg-6 hidden-sm text-right text-white">
                                        <!-- attachment gos here-->
                                        <span v-if="attachment != null" style="margin-right: 10px; position: relative; top: 7px;" v-text="attachment.name"></span>
                                        <a href="javascript:void(0);" class="btn btn-outline-secondary pull-right text-white" v-on:click="selectFile">
                                            <i class="fa fa-paperclip"></i>
                                        </a>
                                        <input type="file" id="attachment" style="display: none;" v-on:change="fileSelected">
                                    </div>
                                </div>
                            </div>
    
                            <div class="chat-history">
                                <ul class="m-b-0">
                                    <!-- all messages gone here-->
                                    <li class="clearfix" v-for="msg in messages" v-bind:key="msg._id">
                                        <div v-bind:class="'message-data ' + (user != null && user.email == msg.sender.email ? 'text-right' : '')">
                                            <span class="message-data-time text-white" v-text="getMessageTime(msg.createdAt)"></span>
                                            <img src="../../public/images/photo.jpg" alt="" style="width: 50px; height: 50px; border-radius: 50%; margin-left: 8px;">
                                        </div>
                                        <div v-bind:class="'message ' + (user != null && user.email == msg.sender.email ? 'my-message float-right' : 'other-message')">
                                            <p v-text="msg.message" v-bind:class="(user != null && user.email == msg.sender.email ? 'text-right' : '')" style="margin-bottom: 0px;"></p>
                                            <template v-if="msg.attachment != null">
                                                <div>
                                                    <a href="javascript:void(0);" v-bind:data-id="msg._id" v-on:click.prevent="downloadAttachment" v-text="msg.attachment.displayName" class="text-info" target="_blank"></a>
                                                </div>
                                            </template>
                                        </div>
                                    </li>
                                </ul>
                            </div>
    
                            <div class="chat-message clearfix">
                                <div class="input-group mb-0">
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" v-model="message" placeholder="Enter text here...">
                                        <button class="btn btn-primary" v-on:click="sendMessage" type="button">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a v-bind:href="base64Str" ref="btnDownloadAttachment" v-bind:download="downloadFileName"></a>
    </div>
</template>

<script>
import "../../public/assets/css/chat.css"
import axios from 'axios'
import Swal from "sweetalert2"
import store from "../vuex/store"
export default {
    data() {
        return {
            message: "",
            page: 0,
            email: this.$route.params.email,

           // messages: [],
            receiver: null,
            attachment: null,
            base64Str: "",
            downloadFileName: ""
        }
    },

    watch: {
        $route: function (to, from) {
            if (from.href.includes("/chat/")) {
                store.commit("setMessages", [])
            }
        }
    },

    computed: {
        messages() {
            return store.getters.getMessages
        }
    },

    methods: {
        downloadAttachment: async function () {
           const anchor = event.target
           const id = anchor.getAttribute("data-id")
           const originalHtml = anchor.innerHTML
           anchor.innerHTML = "Loading..."

           const formData = new FormData()
           formData.append("messageId", id)

           const response = await axios.post(
            this.$apiURL + "/chat/attachment",
            formData,
            {
                headers: {
                        ...this.$headers,
                        'Content-Type': 'multipart/form-data'
                    }
            }
           )

           if (response.data.status == "success") {
            this.base64Str = response.data.base64Str
            this.downloadFileName = response.data.fileName

            const btnDownloadAttachment = this.$refs["btnDownloadAttachment"]
            setTimeout(function () {
                btnDownloadAttachment.click()
                anchor.innerHTML = originalHtml
            }, 500)
           } else {
            Swal.fire("Error", response.data.message, "error")
           }
        },
    fileSelected: function () {
    const files = event.target.files
    if (files.length > 0) {
        this.attachment = files[0]
    }
},
        selectFile: function () {
            document.getElementById("attachment").click()
        },
        getData: async function () {
            if (this.email == null) {
                return;
            }

            const formData = new FormData()
            formData.append("email", this.email)
            formData.append("page", this.page)

            const response = await axios.post(
                this.$apiURL + "/chat/fetch",
                formData,
                {
                    headers: this.$headers
                }
            )
            console.log(response)

            if (response.data.status == "success") {
                for (let a = 0; a < response.data.messages.length; a++) {
                    //this.messages.unshift(response.data.messages[a])
                    store.commit("prependMessage", response.data.messages[a])
                }
                this.receiver = response.data.receiver
                this.user = response.data.user
            } else {
                Swal.fire("Error", response.data.message, "error")
            }
        },

        getMessageTime: function (time) {
            const dateObj = new Date(time)
            let timeStr = dateObj.getFullYear() + "-" + (
                dateObj.getMonth() + 1) + "-" + dateObj.getDate() + " " + dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds()
                return timeStr
        },


        sendMessage: async function () {
            const formData = new FormData()
            formData.append("email", this.email)
            formData.append("message", this.message)
            
            // Ajouter la pièce jointe au formData
            if (this.attachment != null) {
                formData.append("attachment", this.attachment)
            }

            const response = await axios.post(
                this.$apiURL + "/chat/send",
                formData,
                {
                    headers: {
                        ...this.$headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (response.data.status == "success") {
                this.message = ""
                this.attachment = null
                document.getElementById("attachment").value = null

                //this.messages.push(response.data.messageObject)
                store.commit("appendMessage", response.data.messageObject)
            } else {
                Swal.fire("Error", response.data.message, "error")
            }
        },
    },
    mounted() {
        this.getData();
    }
}
</script>