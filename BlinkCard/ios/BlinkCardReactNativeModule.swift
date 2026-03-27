//
//  BlinkCardReactNativeModule.swift
//  BlinkCardReactNative
//
//  Created by Milan Parađina on 09.03.2026..
//

import Foundation
import BlinkCard
import BlinkCardUX
import Combine
import SwiftUI

@objc
public class BlinkCardReactNativeModule: NSObject {
    
    private var blinkCardSdk: BlinkCardSdk?
    private var cancellables = Set<AnyCancellable>()
    
    @objc
    public func performScan(blinkCardSdkSettings: [String: Any], blinkCardSessionSettings: [String: Any], scanningUxSettings: [String: Any],
                            rootViewController: UIViewController, onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        
        Task {
            do {
                blinkCardSdk = try await ensureLoadedSdk(blinkCardSdkSettings)
                guard let blinkCardSdk else {
                    onReject(BlinkCardReactNativeError.initializationError(message: "The BlinkCard SDK is not initialized. Call the loadSdk() method to pre-load the SDK first, or try running the performScan() method with a valid internet connection.").errorDescription ?? "")
                    return
                }
                
                
                let sessionSettings = BlinkCardDeserializationUtils.deserializeSessionSettings(blinkCardSessionSettings)
                let scanningUxSettings = BlinkCardDeserializationUtils.deserializeScanningUxSettings(scanningUxSettings)
                
                let analyzer = try await BlinkCardAnalyzer(sdk: blinkCardSdk, blinkCardSessionSettings: sessionSettings, eventStream: BlinkCardEventStream())
                
                await addReactNativePinglet(with: analyzer.sessionNumber)
                
                let uxModel = await BlinkCardUXModel(analyzer: analyzer, uxSettings: scanningUxSettings)
                
                await uxModel.$result
                    .sink { blinkCardResultState in
                    if let blinkCardResultState {
                        if let scanningResult = blinkCardResultState.scanningResult {
                            DispatchQueue.main.async {
                                onResolve(BlinkCardSerializationUtils.serializeBlinkCardScanningResult(scanningResult))
                                rootViewController.dismiss(animated: true)
                            }
                        } else {
                            DispatchQueue.main.async {
                                onReject(BlinkCardReactNativeError.cancelled.errorDescription ?? "")
                                rootViewController.dismiss(animated: true)
                            }
                        }
                    }
                }
                .store(in: &cancellables)
                
                presentScanningUi(rootViewController, uxModel: uxModel)

            } catch {
                switch error {
                    case let error as InvalidLicenseKeyError:
                    onReject(error.message)
                    case let error as BlinkCardReactNativeError:
                    onReject(error.errorDescription ?? "")
                default:
                    onReject(error.localizedDescription)
                }

            }
        }
    }
    
    @objc
    public func performDirectApiScan(blinkCardSdkSettings: [String: Any], blinkCardSessionSettings: [String: Any], firstSideImage: String, secondSideImage: String?, onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task {
            do {
                blinkCardSdk = try await ensureLoadedSdk(blinkCardSdkSettings)
                guard let blinkCardSdk = blinkCardSdk else {
                    throw BlinkCardReactNativeError.initializationError(message: "The BlinkCard SDK is not initialized. Call the loadSdk() method to pre-load the SDK first, or try running the performScan() method with a valid internet connection.")
                }
                
                let session = try await blinkCardSdk.createScanningSession(sessionSettings: BlinkCardDeserializationUtils.deserializeSessionSettings(blinkCardSessionSettings))
                
                await addReactNativePinglet(with: session.getSessionNumber())
                
                guard let firstSideImage = BlinkCardDeserializationUtils.deserializeBase64Image(firstSideImage) else {
                    throw BlinkCardReactNativeError.imageIsEmpty(message: "Invalid first image provided!")
                }
                
                let _ = try await session.process(inputImage: .init(uiImage: firstSideImage))
                
                if let secondSideImage = BlinkCardDeserializationUtils.deserializeBase64Image(secondSideImage) {
                    let _ = try await session.process(inputImage: .init(uiImage: secondSideImage))
                }
                
                let blinkCardResult = await session.getResult()
                DispatchQueue.main.async {
                    onResolve(BlinkCardSerializationUtils.serializeBlinkCardScanningResult(blinkCardResult))
                }
                
            } catch {
                switch error {
                    case let error as InvalidLicenseKeyError:
                    onReject(error.message)
                    case let error as BlinkCardReactNativeError:
                    onReject(error.errorDescription ?? "")
                default:
                    onReject(error.localizedDescription)
                }
            }
        }
    }
    
    @objc
    public func loadSdk(blinkCardSdkSettings: [String: Any], onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task {
            do {
                let _ = try await ensureLoadedSdk(blinkCardSdkSettings)
                onResolve("")
            } catch {
                switch error {
                    case let error as InvalidLicenseKeyError:
                    onReject(error.message)
                    case let error as BlinkCardReactNativeError:
                    onReject(error.errorDescription ?? "")
                default:
                    onReject(error.localizedDescription)
                }
            }
        }
    }
    
    @objc
    public func unloadSdk(deleteCachedResources: Bool, onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task {
            if deleteCachedResources {
                await BlinkCardSdk.terminateBlinkCardSdkAndDeleteCachedResources()
            } else {
                await BlinkCardSdk.terminateBlinkCardSdk()
            }
            blinkCardSdk = nil
            onReject("")
        }
    }
    
    private func ensureLoadedSdk(_ blinkCardSdkSettings: [String: Any]) async throws -> BlinkCardSdk? {
        if let blinkCardSdk = blinkCardSdk { return blinkCardSdk }
        do {
            let sdkSettings = try BlinkCardDeserializationUtils.deserializeSdkSettings(blinkCardSdkSettings)
            blinkCardSdk = try await BlinkCardSdk.createBlinkCardSdk(withSettings: sdkSettings)
            return blinkCardSdk
        } catch {
            blinkCardSdk = nil
            throw error
        }
    }
    
    private func addReactNativePinglet(with sessionNumber: Int) async {
        await PingManager.shared
            .addPinglet(pinglet: WrapperProductInfoPinglet(wrapperProduct: .crossplatformreactnative), sessionNumber: sessionNumber)
    }
    
    private func presentScanningUi(_ rootViewController: UIViewController, uxModel: BlinkCardUXModel) {
        DispatchQueue.main.async {
            let hostingVc = UIHostingController(rootView: BlinkCardUXView(viewModel: uxModel))
            hostingVc.modalPresentationStyle = .fullScreen
            rootViewController.present(hostingVc, animated: true)
        }
    }
}

enum BlinkCardReactNativeError: Error, LocalizedError {
    case invalidLicenseKeyProvided
    case imageIsEmpty(message: String)
    case cancelled
    case initializationError(message: String)
    case error(message: String)
    
    var errorDescription: String? {
        switch self {
        case .invalidLicenseKeyProvided: return "Invalid license key provided"
        case .imageIsEmpty(let message): return message
        case .cancelled: return "Scanning has been cancelled"
        case .initializationError(let message): return "Initialization error: \(message)"
        case .error(let message): return "Error: \(message)"
        }
    }
}
