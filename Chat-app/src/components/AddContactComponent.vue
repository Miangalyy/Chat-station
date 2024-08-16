<!--<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1 class="text-center text-white">Add Contact</h1>
            </div>
        </div>
        <div class="row">
            <div class="offset-md-3 col-md-6">
                <form method="POST" v-on:submit.prevent="addContact">
                    <div class="form-group">
                        <label class="text-white">Name</label>
                        <input type="text" class="form-control" name="name">
                    </div>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">email</label>
                        <input type="email" class="form-control" name="email">
                    </div>
                    <div class="d-grid gap-2">
                        <input type="submit" class="btn btn-primary" v-bind:value="isLoading ? 'Adding...' : 'Add Contact'" v-bind:disabled="isLoading">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import swal from 'sweetalert2';

export default {
    data () {
        return {
            "isLoading": false
        }
    },
    methods: {
        addContact: async function () {
            const self = this
            const form  = event.target
            const formData = new FormData(form)

            this.isLoading = true;
            const response  = await axios.post(this.$apiURL + "contact/save",
                formData,
                {
                    headers: this.$headers
                }
            );

            this.isLoading = false;
            swal.fire("Add Contact", response.data.message,
            response.data.status);

            if (response.data.status == "success") {
                form.reset();
            }
        }
    }
}
</script>-->
<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1 class="text-center text-white">Add Contact</h1>
            </div>
        </div>
        <div class="row">
            <div class="offset-md-3 col-md-6">
                <form @submit.prevent="addContact">
                    <div class="form-group">
                        <label class="text-white">Name</label>
                        <input type="text" class="form-control" name="name" v-model="contact.name">
                    </div>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">Email</label>
                        <input type="email" class="form-control" name="email" v-model="contact.email">
                    </div>
                    <div class="d-grid gap-2">
                        <input type="submit" class="btn btn-primary" :value="isLoading ? 'Adding...' : 'Add Contact'" :disabled="isLoading">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert2';

export default {
    data() {
        return {
            isLoading: false,
            contact: {
                name: '',
                email: ''
            }
        };
    },
    methods: {
        async addContact() {
            this.isLoading = true;
            try {
                const response = await axios.post(
                    `${this.$apiURL}/contact/save`,
                    this.contact,
                    { headers: this.$headers }
                );

                swal.fire("Add Contact", response.data.message, response.data.status);

                if (response.data.status === "success") {
                    this.contact.name = '';
                    this.contact.email = '';
                }
            } catch (error) {
                console.error(error);
                swal.fire("Error", "An error occurred", "error");
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
