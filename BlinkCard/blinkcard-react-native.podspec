require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'blinkcard-react-native'
  s.version      = package['version']
  s.summary      = package['description']
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.platform     = :ios, "13.0"
  s.source       = { :git => "https://github.com/BlinkCard/blinkcard-react-native.git", :tag => "v#{s.version}" }
  s.source_files  = "src/ios", "src/ios/**/*.{h,m}"
  s.dependency 'React'
  s.dependency 'MBBlinkCard', '~> 2.12.0'
  s.frameworks = 'UIKit'
end
