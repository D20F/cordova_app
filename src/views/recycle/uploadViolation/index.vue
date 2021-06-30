<template>
    <div class="box">
        <div class="photos">
            <div class="title">
                <p>留证提醒</p>
            </div>
            <div class="upload" v-for="(item, index) in phone" :key="index">
                <div
                    v-if="item.file == ''"
                    class="add"
                    @click="photograph(index)"
                >
                    <img src="@/static/img/recycle/add.png" />
                </div>
                <div v-else class="cache">
                    <img class="img" :src="item.file" />
                    <img
                        class="rm"
                        src="@/static/img/recycle/close.png"
                        @click="remove(index)"
                    />
                </div>
            </div>

            <div @click="confirm" class="btn">
                <p>上传</p>
            </div>
        </div>
    </div>
</template>

<script>
import publics from "@/mixins/public.js";
import axios from "axios";

export default {
    data() {
        return {
            query: {},
            upload_list: [],
            phone: [
                {
                    file: "",
                },
                {
                    file: "",
                },
                {
                    file: "",
                },
            ],
        };
    },
    mixins: [publics],
    methods: {
        remove(index) {
            let ix = this.upload_list.findIndex(
                (item) => item == this.phone[index].file
            );
            this.upload_list.splice(ix, 1);
            this.phone[index].file = "";
        },
        confirm() {
            if (
                this.phone[0].file == "" &&
                this.phone[1].file == "" &&
                this.phone[2].file == ""
            ) {
                return this.$toast({
                    content: "未选择文件",
                });
            }
            this.$loading({
                content: "上传中",
                mask: true,
                icon: true,
            });
            let that = this;

            // 同步有问题

            var formdata = new FormData();
            formdata.append("address", that.query.address);
            formdata.append("name", that.query.name);
            formdata.append(
                "licenseplatenumber",
                that.$store.state.account.carNumber
            );
            for (let index = 0; index < this.upload_list.length; index++) {
                resolveLocalFileSystemURL(
                    that.upload_list[index],
                    (fileEntry) => {
                        fileEntry.file((file) => {
                            let reader = new FileReader();
                            reader.onloadend = function(e) {
                                let blob = new Blob(
                                    [new Uint8Array(e.target.result )],
                                    { type: file.type }
                                );
                                formdata.append("file", blob, file.name);
                                if (index == that.upload_list.length - 1) {
                                    setTimeout(() => {
                                        let token = localStorage.getItem('longjinhetoken');
                                        axios
                                            .post(
                                                "http://temp.dufook.cn/app/recovery/abnormal",
                                                formdata,
                                                { headers: { token: token } }
                                            )
                                            .then((res) => {
                                                if (res.data.status == 200) {
                                                    that.$loadingHide();
                                                    that.$toast({
                                                        content: "上传成功",
                                                    });
                                                    setTimeout(() => {
                                                        that.$router.go(-1);
                                                    }, 1500);
                                                } else {
                                                    that.$loadingHide();
                                                    that.$toast({
                                                        content: "上传失败",
                                                    });
                                                }
                                            })
                                            .catch((err) => {
                                                that.$loadingHide();
                                                that.$toast({
                                                    content: "上传失败",
                                                });
                                            });
                                    }, 200);
                                }
                            };
                            reader.readAsArrayBuffer(file);
                        });
                    },
                    (err) => {
                        that.$loadingHide();
                        that.$toast({
                            content: "读取文件失败",
                        });
                    }
                );
            }
            
        },
        photograph(index) {
            let that = this;
            navigator.camera.getPicture(
                (fileURL) => {
                    that.phone[index].file = fileURL;
                    that.upload_list.push(fileURL);
                },
                (err) => {
                    this.$toast({
                        content: "拍照失败",
                    });
                },
                {
                    quality: 50,
                    saveToPhotoAlbum: true,
                }
            );
        },
    },
    created() {
        this.query = this.$route.query;
    },
    computed: {},
};
</script>


<style  lang="scss">
.box {
    width: 100%;
    height: inherit;
}
.web {
    width: 100%;
    height: 100px;
    position: relative;
}
.photos {
    width: 100%;
    height: 50%;
    padding: 0 5%;
    bottom: 0;
    background: #ffffff;
    border-radius: 10px;
    .title {
        width: 100%;
        margin: 0 auto 20px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p:nth-child(1) {
            font-size: 22px;
            font-weight: 600;
            color: #242424;
        }
        p:nth-child(2) {
            font-size: 15px;
            color: #b3b3b3;
        }
    }
    .upload {
        width: 30%;
        height: 137px;
        margin: 0 3.3% 10px 0;
        background: #f7f8f9;
        border-radius: 12px;
        display: inline-block;
        vertical-align: top;
        .add {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 15px;
                height: 15px;
            }
        }
        .cache {
            width: 100%;
            height: 137px;
            .img {
                width: 100%;
                height: 137px;
            }
            .rm {
                width: 15px;
                height: 15px;
                position: absolute;
                right: 5%;
                top: 5%;
                z-index: 899;
            }
            video {
                width: 100%;
                height: 100%;
            }
        }
    }
}

.btn {
    position: fixed;
    bottom: 20px;
    width: 90%;
    height: 45px;
    border-radius: 8px;
    margin: 0 auto;
    text-align: center;
    background: #00b075;
    p {
        color: #ffffff;
        line-height: 45px;
        font-size: 16px;
    }
}
</style>
