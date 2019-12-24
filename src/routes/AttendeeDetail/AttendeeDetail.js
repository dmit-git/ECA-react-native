import React, { Component, Fragment } from 'react'
import { Actions } from 'react-native-router-flux'
import FlexImage from 'react-native-flex-image'
import { StyleSheet, View, Platform, Clipboard } from 'react-native'
import { 
  Content,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Icon,
  Container,
  Button,
  Fab,
  Tab,
  Tabs,
} from 'native-base'
import Contacts from 'react-native-contacts'
import Header from '../../components/Header'
import Kudos from '../../components/Kudos'
import analyticsStore from '../../stores/analyticsStore'
import { uploadAttendeeImage } from '../../uploadImage'
import ImagePicker from 'react-native-image-picker';
import {default as AndroidImagePicker} from 'react-native-image-crop-picker';
import Networking from '../../components/Networking';

const optionsImageGallery = {
  allowsEditing : true,
  mediaType: 'photo',
};

let Constants = require('../../../app.json');

const { CHAT_ENABLED } = Constants.expo.extra

const hasGeoData = (attendee) => {
  return (
    attendee.district ||
    attendee.region ||
    attendee.area ||
    attendee.address ||
    attendee.city ||
    attendee.county ||
    attendee.country ||
    attendee.state ||
    attendee.postal_code
  )
}

const renderGeoData = (attendee) => {
  return (
    <Fragment>
      { attendee.district ? (
        <ListItem>
          <Body>
            <Text note>District</Text>
            <Text>{attendee.district}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.region ? (
        <ListItem>
          <Body>
            <Text note>Region</Text>
            <Text>{attendee.region}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.area ? (
        <ListItem>
          <Body>
            <Text note>Area</Text>
            <Text>{attendee.area}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.address ? (
        <ListItem>
          <Body>
            <Text note>Address</Text>
            <Text>{attendee.address}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.city ? (
        <ListItem>
          <Body>
            <Text note>City</Text>
            <Text>{attendee.city}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.county ? (
        <ListItem>
          <Body>
            <Text note>County</Text>
            <Text>{attendee.county}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.country ? (
        <ListItem>
          <Body>
            <Text note>Country</Text>
            <Text>{attendee.country}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.state ? (
        <ListItem>
          <Body>
            <Text note>State</Text>
            <Text>{attendee.state}</Text>
          </Body>
        </ListItem>
      ) : null}
      { attendee.postal_code ? (
        <ListItem>
          <Body>
            <Text note>Postal Code</Text>
            <Text>{attendee.postal_code}</Text>
          </Body>
        </ListItem>
      ) : null}
    </Fragment>
  )
}

export default class AgendaItem extends Component {
  state = {
    avatar_url: '',
    uploading: false
  }

  componentDidMount () {
    analyticsStore.sendScreenView(`Attendee Detail - ${this.props.attendee.email}`)
  }

  addToContacts = () => {
    const { attendee } = this.props;
    let newPerson = {
      emailAddresses: [{
        label: "work",
        email: attendee.email,
      }],
      familyName: attendee.last_name,
      givenName: attendee.first_name,
    };

    if(attendee.avatar_url !== ""){
      newPerson.hasThumbnail = true,
      newPerson.thumbnailPath = attendee.avatar_url
    }

    Contacts.openContactForm(newPerson, (err, contact) => {
      if (err) console.warn(err) ;
      // form is open
    });
  }

  takePhoto = async () => {
    if (Platform.OS === 'android') {
      AndroidImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true
      }).then(response => {
        console.log(response);
        if (!response.cancelled) {
          console.log(response);
          this.handleImagePicked(response)
        }
      })
        .catch(e => {
          console.log("Error While Selection.. : ", e);
          alert('Plese try again.')
        });
    }
    else {

    ImagePicker.launchCamera(optionsImageGallery, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert('Plese try again.')
      } else {
        const source = { uri: response.uri };
        console.log("Here is Your Responseeeeee");
        console.log(source);
        console.log(response);
        if (!response.cancelled) {
                this.handleImagePicked(response)
          }
      }
    });
  }
  }

  pickImage = async () => {

    if (Platform.OS === 'android') {
      AndroidImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(response => {
        console.log(response);
        if (!response.cancelled) {
          console.log(response);
          this.handleImagePicked(response)
        }
      })
        .catch(e => {
          console.log("Error While Selection.. : ", e);
          alert('Plese try again.')
        });
    }
    else {    
    ImagePicker.launchImageLibrary(optionsImageGallery, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert('Plese try again.')
      } else {
        const source = { uri: response.uri };
        console.log("Here is Your Responseeeeee");
        console.log(source);
        console.log(response);
        if (!response.cancelled) {
          this.handleImagePicked(response)
        }
      }
    });
  }
  }

  handleImagePicked = async pickerResult => {
    let uploadResponse

    try {
      this.setState({ uploading: true })

      if (!pickerResult.cancelled) {
        if (Platform.OS === 'android') {
          uploadResponse = await uploadAttendeeImage(pickerResult.path)
        }
        else {
          uploadResponse = await uploadAttendeeImage(pickerResult.uri)
        }

        const mediaJSON = await uploadResponse.json()
        const { id, name, src, mime_type } = mediaJSON
        this.setState({ avatar_url: src, uploading: false })
      }
    } catch (e) {
      console.log('AttendeeDetail.handleImagePicked error', e)
      alert('Oops! Something went wrong. If this keeps happening, contact your event administrator.')
    }
  }

  render () {
    const { uploading, avatar_url } = this.state;
    const { attendee, isMe } = this.props;

    const photoUrl = avatar_url || attendee.avatar_url;
    const profilePhoto = photoUrl ? (
        <FlexImage style={styles.banner} source={{uri: photoUrl}} />
      ) : null;
    const profilePhotoButtons = isMe ? (
        <View style={{ paddingBottom: 10 }}>
          <Button icon full primary onPress={this.pickImage} disabled={uploading}>
            <Icon name='md-images' />
            <Text>Upload Avatar Photo</Text>
          </Button>
          <Button icon full primary onPress={this.takePhoto} disabled={uploading}>
            <Icon name='md-camera' />
            <Text>Select Avatar Photo</Text>
          </Button>
        </View>
      ) : <Fragment />;

    const profilePhotoSection = (
      <Fragment>
        {profilePhoto}
        {profilePhotoButtons}
      </Fragment>
    );

    // get this from global var or Constants.manifest
    const NETWORKING_ENABLED = true;
    const headSection = isMe && NETWORKING_ENABLED ? (
        <Tabs>
          <Tab heading="Profile Photo">
            {profilePhotoSection}
          </Tab>
          <Tab heading="Connect">
            <Networking attendee={attendee}/>
          </Tab>
        </Tabs>
      ) : profilePhotoSection;

    return (
      <Container>
        <Header
          headerTitle={`${attendee.first_name} ${attendee.last_name}`}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <Content>
          { headSection }
          
          <ListItem icon last style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
            <Left>
              <Icon name='md-mail' />
            </Left>
            <Body>
              <Text note>Email</Text>              
              <Text selectable >{attendee.email}</Text>              
            </Body>
            <Right>
              <Button icon primary rounded transparent small onPress={  Clipboard.setString(attendee.email) } style={{padding: 0}}>
                <Icon name='copy' style={{fontSize: 14}}/>
              </Button>
            </Right>
          </ListItem>
          { attendee.title ? (
            <ListItem icon>
              <Left>
                <Icon name='md-briefcase' />
              </Left>
              <Body>
                <Text note>Title</Text>
                <Text>{attendee.title}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.company ? (
            <ListItem icon>
              <Left>
                <Icon name='md-business' />
              </Left>
              <Body>
                <Text note>Company</Text>
                <Text>{attendee.company}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.bio ? (
            <ListItem>
              <Body>
                <Text note>Bio</Text>
                <Text>{attendee.bio}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.team ? (
            <ListItem icon>
              <Left>
                <Icon name='md-contacts' />
              </Left>
              <Body>
                <Text note>Team</Text>
                <Text>{attendee.team}</Text>
              </Body>
            </ListItem>
          ) : null }
          { hasGeoData(attendee) ? (
            renderGeoData(attendee)
          ) : null }
          { attendee.phone_number ? (
            <ListItem icon>
              <Left>
                <Icon name='md-call' />
              </Left>
              <Body>
                <Text note>Phone Number</Text>
                <Text>{attendee.phone_number}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.mobile_number ? (
            <ListItem icon>
              <Left>
                <Icon name='md-phone-portrait' />
              </Left>
              <Body>
                <Text note>Mobile Number</Text>
                <Text>{attendee.mobile_number}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.facebook_url ? (
            <ListItem icon>
              <Left>
                <Icon name='logo-facebook' />
              </Left>
              <Body>
                <Text note>Facebook</Text>
                <Text>{attendee.facebook_url}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.linkedin_url ? (
            <ListItem icon>
              <Left>
                <Icon name='logo-linkedin' />
              </Left>
              <Body>
                <Text note>LinkedIn</Text>
                <Text>{attendee.linkedin_url}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.website_url ? (
            <ListItem icon>
              <Left>
                <Icon name='md-link' />
              </Left>
              <Body>
                <Text note>Website</Text>
                <Text>{attendee.website_url}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.twitter_url ? (
            <ListItem icon>
              <Left>
                <Icon name='logo-twitter' />
              </Left>
              <Body>
                <Text note>Twitter</Text>
                <Text>{attendee.twitter_url}</Text>
              </Body>
            </ListItem>
          ) : null }
          { attendee.blog_url ? (
            <ListItem icon>
              <Left>
                <Icon name='md-megaphone' />
              </Left>
              <Body>
                <Text note>Blog</Text>
                <Text>{attendee.blog_url}</Text>
              </Body>
            </ListItem>
          ) : null }

        <Kudos attendee={attendee} isMe={isMe}/>

        <Body>
          <Button style={{marginTop: 55}} onPress={()=> this.addToContacts()}>
            <Text>  Add to Device Contacts  </Text>
          </Button>
        </Body>

        </Content>
        
        

        {
          !isMe && CHAT_ENABLED && attendee.has_chat_user ? (
            <Fab
              style={{ backgroundColor: 'black' }}
              position='bottomRight'
              onPress={this.props.handleCreateRoom(attendee.email)}>
              <Icon name='md-send' />
            </Fab>
          ) : null
        }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  description: {
    padding: 12
  }
})
