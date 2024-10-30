import { HelpersService } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as htmlToImage from 'html-to-image';
import { Share } from '@capacitor/share';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

const INVITATION_DIR = 'stored-qrCode';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(
    private helper: HelpersService,
    private sharing: SocialSharing
  ) { }

  async createFolder() {
    Filesystem.readdir({
      path: INVITATION_DIR,
      directory: Directory.Data,
    }).then(async result => {
      // Folder  exists!

    },
      async (err) => {
        // Folder does not exists!
        await Filesystem.mkdir({
          path: INVITATION_DIR,
          directory: Directory.Data,
        });
      }
    )
  }

  // generate image from html
  async generateImage(node: any) {
    return await htmlToImage.toPng(node)
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  async writeFile(database64: any, name: any) {
    const file = await Filesystem.writeFile({
      path: `${INVITATION_DIR}/${name}_${new Date().getTime()}.png`,
      data: database64,
      directory: Directory.Data
    })

    return file
  }

  async share(uri: any) {
    this.helper.dismissLoading()
    this.sharing.share(
      'هذا رابط حسابي',
      'يمكنك مشاهدة اعلاناتي',
      uri)
      .catch(err => {
        console.log(err);
      })
    // await Share.share({
    //   title: 'this your invitaion',
    //   url: uri,
    // }).catch(err => {
    //   console.log(err);
    // })
  }

  async startSharing(node: any) {
    // await this.createFolder();
    let image = await this.generateImage(node);
    await this.share(image)

  }

}
