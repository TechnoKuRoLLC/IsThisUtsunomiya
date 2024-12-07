import java.io.File
import org.apache.tools.ant.taskdefs.condition.Os
import org.gradle.api.DefaultTask
import org.gradle.api.GradleException
import org.gradle.api.logging.LogLevel
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction

open class BuildTask : DefaultTask() {
    @Input
    var rootDirRel: String? = null
    @Input
    var target: String? = null
    @Input
    var release: Boolean? = null

    @TaskAction
    fun assemble() {
        // Windowsとそれ以外のOSでnpxコマンド名が異なる可能性に対応
        val executable = if (Os.isFamily(Os.FAMILY_WINDOWS)) "npx.cmd" else "npx"
        runTauriCli(executable)
    }

    fun runTauriCli(executable: String) {
        val rootDirRel = rootDirRel ?: throw GradleException("rootDirRel cannot be null")
        val target = target ?: throw GradleException("target cannot be null")
        val release = release ?: throw GradleException("release cannot be null")

        // tauriコマンドをnpx経由で呼び出す
        val args = mutableListOf("tauri", "android", "android-studio-script")

        // ログレベルに応じてオプションを追加
        if (project.logger.isEnabled(LogLevel.DEBUG)) {
            args.add("-vv")
        } else if (project.logger.isEnabled(LogLevel.INFO)) {
            args.add("-v")
        }

        // リリースビルドなら--releaseを追加
        if (release) {
            args.add("--release")
        }

        // ターゲット指定
        args.addAll(listOf("--target", target))

        project.exec {
            workingDir(File(project.projectDir, rootDirRel))
            executable(executable) // npxコマンド
            args(args)
        }.assertNormalExitValue()
    }
}
