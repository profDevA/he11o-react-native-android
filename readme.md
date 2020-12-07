Plesk:
	https://he11o.com:8443/
	jovan
	4i?Fnv03

Wordpress:
	he11o.com/id/
	jovan
	aJzX6JT7i3NXUtTZM

Gmail/Play Console:
	admin@he11o.com
	#wuKJGsyhy34su!4l

	https://play.google.com/console/developers/6442458191555112269/app/4974718433799563851/subscriptions/setup

Subscriptions:
	4.95 per month for a card

	One thing you can do is use a consumable IAP and purchase 'Tokens'.  The user can exchange those Tokens for access to one or more other user's content.
	Another thing you can do is non-renewing subscriptions.  A use can purchase many of those and the app can assign each subscription to a particular other user's ongoing content.  But you have no way of assuring that the other user will continue to produce content.
	Using autorenewable subscriptions will be difficult because they do not offer the flexibility your scheme needs.

	iOS:
	Sign he11o app with vikas.upworkdev@gmail.com, Wnw@vikas123 using he11o company profile
		https://learn.buildfire.com/en/articles/2534675-how-to-create-a-subscription-in-app-purchase-for-ios
		https://medium.com/better-programming/react-native-in-app-purchase-subscription-bb7ad18ec5a0
		https://www.iaphub.com/docs/set-up-ios/configure-shared-secret
			Device/Simulator? > Settings > iTunes & App Store > scroll to end of page > Sandbox account section > log in to your sandbox account(notnecessary?@gmail.com, Wnw@vikas123)

		https://stackoverflow.com/questions/61783102/react-native-iap-getproducts-returns-empty-array

	Android:
		https://developer.android.com/google/play/billing/subs
		https://developer.android.com/google/play/billing/getting-ready#products
		https://support.google.com/googleplay/android-developer/answer/140504?hl=en&ref_topic=3452890

	https://medium.com/@rossbulat/react-native-subscriptions-with-in-app-purchases-setup-fdaf3863e07f

/c/"Program Files"/Java/jdk-14.0.1/bin/keytool -genkeypair -v -keystore he11o-release.keystore -alias he11o-release-key -keyalg RSA -keysize 2048 -validity 100000
he11o_wnw
./gradlew bundleRelease

npm install react-native-snap-carousel react-native-svg rn-fetch-blob react-native-fs redux-persist @react-native-community/async-storage react-native-google-places-autocomplete react-native-image-crop-picker react-native-iap --save

./gradlew app:assembleRelease -> Doesn't create bundle(s)

App Logcat:
	adb logcat | grep -F "`adb shell ps | grep com.he11o.profile  | tr -s [:space:] ' ' | cut -d' ' -f2`"